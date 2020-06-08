import { timesheetCollection } from '@root/database'
import { addHours, format, startOfMonth, lastDayOfMonth } from 'date-fns/fp'
import { getUserList } from '@routes/users/get'
import { execute } from '@root/util.js'
import getUserById from '@routes/users/_userId/get'

export default async (req, res) => {
  try {
    const {
      userIds = req.user.id,
      time,
      timezone = '+0',
      startDate,
      endDate,
      getAll = false
    } = req.query

    const timezoneCheck = Number(timezone)
    if (isNaN(timezoneCheck) || timezoneCheck > 12 || timezoneCheck < -12)
      return res.status(500).send({
        message: 'Error timezone'
      })
    let query = timesheetCollection()
    if (userIds.length && !getAll) {
      const ids = userIds.split(/,/)
      query = query.where('userId', 'in', ids)
    }
    if (time) {
      const startTimeServer = new Date(`${time} 00:00:00 GMT ${timezone}`)
      const endTimeServer = addHours(24, startTimeServer)

      if (!isValidDate(startTimeServer))
        return res.status(500).send({ message: 'Error time' })
      query = query
        .where('checkedDate', '>=', startTimeServer)
        .where('checkedDate', '<', endTimeServer)
    } else if (startDate || endDate) {
      if (startDate) {
        const startTimeRangeServer = new Date(
          `${startDate} 00:00:00 GMT ${timezone}`
        )

        if (!isValidDate(startTimeRangeServer))
          return res.status(500).send({ message: 'Error time range' })
        query = query.where('checkedDate', '>=', startTimeRangeServer)
      }
      if (endDate) {
        const endTimeRangeServer = new Date(
          `${endDate} 23:59:59 GMT ${timezone}`
        )

        if (!isValidDate(endTimeRangeServer))
          return res.status(500).send({ message: 'Error time range' })
        query = query.where('checkedDate', '<=', endTimeRangeServer)
      }
    } else {
      const serverTimezone = new Date().getTimezoneOffset() / -60
      const startOfMonthClient = addHours(
        serverTimezone - Number(timezone),
        startOfMonth(new Date())
      )
      const endOfMonthClient = addHours(
        serverTimezone - Number(timezone) + 24,
        lastDayOfMonth(new Date())
      )

      query = query
        .where('checkedDate', '>=', startOfMonthClient)
        .where('checkedDate', '<', endOfMonthClient)
    }
    const timesheetSnapshot = await query
      .orderBy('checkedDate')
      .orderBy('updated', 'desc')
      .get()
    if (timesheetSnapshot.empty) return res.send([])

    const userIdList = timesheetSnapshot.docs
    .reduce((userIdList, timesheet) => {
      return[ ...userIdList, timesheet.data().userId]
    }, [])

    const getUserListResponse =  (await getUserList({
      limit: userIdList.length,
      userIds: userIdList
    }))
    const additionalDataAndFormats = getUserListResponse
      .data
      .reduce((fullNameList,user) => {
        return {
          ...fullNameList,
          [user.id]: user.fullName || ''
        }
      }, {})

    const timesheets = timesheetSnapshot.docs
      .reduce((docs, doc) => {
        let timesheet = doc.data()
        const checkedDate = addHours(Number(timezone), timesheet.checkedDate.toDate())
        timesheet.checkedDate = format('yyyy-MM-dd', checkedDate)
        timesheet = {
          ...timesheet,
          fullName: additionalDataAndFormats[timesheet.userId] || ''
        }
        return [...docs, ...[timesheet]]
      }, [])

    res.send(timesheets)
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Error when get timesheets from firebase.' })
  }
}
function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}

export const addAdditionalDataAndFormat = async (timesheet) => {
  const userNameResponse = await execute(getUserById, {
    params: { userId: timesheet.userId }
  })
  timesheet.fullName =
    userNameResponse.status === 200 ? userNameResponse.body.fullName : ''
  return timesheet
}

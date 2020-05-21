import { timesheetCollection } from '@root/database'
import { addHours, format, startOfMonth, lastDayOfMonth } from 'date-fns/fp'
import { execute } from '@root/util'
import getUserById from '@routes/users/_userId/get'

export default async (req, res) => {
  try {
    const {
      userIds = req.user.id,
      time,
      timezone = '+0',
      startDate,
      endDate
    } = req.query

    const timezoneCheck = Number(timezone)
    if (isNaN(timezoneCheck) || timezoneCheck > 12 || timezoneCheck < -12)
      return res.status(500).send({
        message: 'Error timezone'
      })
    let query = timesheetCollection()
    if (userIds.length) {
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
    const timesheetSnapshot = await query.get()
    if (timesheetSnapshot.empty) return res.send([])
    const timesheets = await timesheetSnapshot.docs
      .map((doc) => doc.data())
      .reduce(async (docs, doc) => {
        const checkedDate = addHours(Number(timezone), doc.checkedDate.toDate())
        doc.checkedDate = format('yyyy-MM-dd', checkedDate)

        doc.fullName = await loadUserFullNameById(doc.userId)
        return [...docs, doc]
      }, [])
    
    res.send(timesheets)
  } catch (e) {
    console.error(e)
    res
      .status(500)
      .send({ message: 'Error when get timesheets from firebase.' })
  }
}
function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}

const loadUserFullNameById = async (userId) => {
  const userResponse = await execute(getUserById, {
    params: { userId}
  })
  if (userResponse.status === 200) return userResponse.body.fullName
  return userId
}

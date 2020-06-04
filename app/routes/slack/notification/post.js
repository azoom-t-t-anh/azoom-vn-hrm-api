import { slackBot } from '@helpers/slack/createSlackbot'
// TODO: Cho ra chơi với constansts hoặc env
const urlChannel = `https://slack.com/app_redirect?channel=`
const colorNotification = '#3AA3E3'

export default async (req, res) => {
  try {
    if (checkNotification(req.body)) return res.sendStatus(400)

    const getSenderInfo = await slackBot.users.info({ users: req.body.senderId })
    const [senderInfo] = getSenderInfo.users
    if (!senderInfo) return res.sendStatus(400)

    const resultsSendNotification = await Promise.all(await sendNotificationSlackBot(req.body, senderInfo))
    return res.send(resultsSendNotification)
  } catch {
    return res.sendStatus(500)
  }
}

const sendNotificationSlackBot = async (data, senderInfo) => {
  const {
    receiverIds = [],
    title,
    content,
    typeNotice, //leave-application || payment-request & typeId = 1
    requestId, // if typeId == 1
    typeId, //1 || 0
    options,
  } = data
  return await receiverIds.map(async (memberId) => {
    const getReceiverInfo = await slackBot.users.info({ users: memberId })
    const [receiverInfo] = getReceiverInfo.users
    if (!receiverInfo) {
      return {
        memberId,
        status: false
      }
    }
    const attachment = {
      author_name: senderInfo.name,
      title,
      text: content,
      callback_id: requestId,
      color: colorNotification,
      actions: [],
    }
    if (typeId === 1) {
      attachment.actions = renderActions(options, typeNotice)
    }

    const sendNotification = await slackBot.chat.postMessage({
      channel: memberId,
      text: `You have a notice from <${urlChannel}${senderInfo.id}|${senderInfo.name}>`,
      attachments: [attachment],
    })

    return {
      memberId,
      status: sendNotification.ok
    }
  })
}

const renderActions = (options, typeNotice) => {
  return options.map((option) => {
    const { typeOption, value } = option
    const action = {
      name: typeNotice,
      type: typeOption,
      style: '',
      value,
      text: value,
    }
    if (value === 'Reject') {
      action.style = 'danger'
    } else if (value === 'Approve') {
      action.style = 'primary'
    } else action.style = 'default'
    return action
  })
}

const checkNotification = (notification) => {
  const {
    receiverIds = [],
    senderId,
    title,
    content,
    typeId, //1 || 0
  } = notification
  return (
    receiverIds.length === 0 ||
    !senderId ||
    title === '' ||
    content === '' ||
    !typeId
  )
}

import * as constants from '@root/constants'
import { io } from '@root/main'

export function initIOListener(io) {
  if (!io) return

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query
    socket.join(constants.rooms.TIMELINE)
    socket.to(constants.rooms.TIMELINE).emit('join', `${userId} connected !`)
  })
}

export function sendMessageToRoom(
  namespace = '/',
  room = '',
  event = '',
  message = ''
) {
  try {
    io.of(namespace).to(room).emit(event, message)
  } catch (err) {
    console.error(
      `socket - sendMessageToRoom catch error:`,
      JSON.stringify(err, null, 4)
    )
  }
}

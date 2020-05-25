import express from 'express'
import http from 'http'
import nnnRouter from 'nnn-router'
import promiseRouter from 'express-promise-router'
import cors from 'cors'
import bodyParser from 'body-parser'
import expressOpenApiMiddleware from 'openapi-express-middleware'
import Server from 'socket.io'
import swaggerFile from './openapi.json'
import { initIOListener } from './socket'
import * as constants from '@root/constants'

const options = {
  transports: ['polling', 'websocket'],
  allowUpgrades: true
}

import statuses from 'statuses'

import { authMiddleware } from '@middleware/auth'

express.response.sendStatus = function (statusCode) {
  const body = { message: statuses[statusCode] || String(statusCode) }
  this.statusCode = statusCode
  this.type('json')
  this.send(body)
}

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(
  cors({
    origin: true,
    credential: true
  }),
  (error, req, res, next) => {
    if (error) {
      return res.status(400).json({
        message: error.message
      })
    }
    next()
  }
)

app.use(authMiddleware)

app.use(
  expressOpenApiMiddleware(swaggerFile, app, {
    enableBodyParser: false,
    enableValidateRequest: false
  }),
  (error, req, res, next) => {
    if (error) {
      return res.status(400).json({
        message: error.message
      })
    }
    return next()
  }
)

app.use(
  nnnRouter({ routeDir: '/routes', baseRouter: promiseRouter() }),
  (error, req, res, next) => {
    console.error(error)
    return res.sendStatus(500)
  }
)

const server = http.createServer(app)
const io = Server(server, options)

server.listen(process.env.PORT || 8080, (err) => {
  if (err) {
    return console.error(err)
  }
  initIOListener(io)
  console.log(`Server is running at port ${process.env.PORT || 8080}`);
})

export { app, server, io }

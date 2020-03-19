import express from 'express'
import nnnRouter from 'nnn-router'
import promiseRouter from 'express-promise-router'
import cors from 'cors'
import bodyParser from 'body-parser'

import statuses from 'statuses'

import { authMiddleware } from '@middleware/auth-middleware'
// import { errorHandlerMiddleware } from '@middleware/error-handler'
express.response.sendStatus = function(statusCode) {
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
// app.use(authMiddleware)
app.use(nnnRouter({ routeDir: '/routes', baseRouter: promiseRouter() }))

app.listen(process.env.PORT || 8080, err => {
  if (err) {
    return console.error(err)
  }
})

export default app

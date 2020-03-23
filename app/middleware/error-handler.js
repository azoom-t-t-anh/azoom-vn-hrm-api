import express from 'express'

const router = new express.Router()

export const errorHandlerMiddleware = router.use((error, req, res, next) => {
  if (isMulterError(error)) {
    // return handleMulterError(error, req, res)
  }
  return res.sendStatus(500)
})
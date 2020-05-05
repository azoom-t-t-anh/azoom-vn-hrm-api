import { camel, snake } from 'to-case'
import _ from 'lodash/fp'
import httpMocks from 'node-mocks-http'

export const camelize = (obj) => {
  return Object.entries(obj).reduce((o, [key, value]) => {
    o[camel(key)] = value
    return o
  }, {})
}

export const underscore = (obj) => {
  return Object.entries(obj).reduce((o, [key, value]) => {
    o[snake(key)] = value
    return o
  }, {})
}

export const flowAsync = (...fns) => {
  const wrap = (fn) => (args) => {
    return new Promise((resolve) => {
      return resolve(args)
    }).then(fn)
  }
  const wrappedFns = fns.map((fn) => wrap(fn))
  return _.flow(wrappedFns)
}

export const placeholders = (array) => {
  return array.map((_) => '?').join(',')
}

export const execute = async (func, req) => {
  const mockReq = httpMocks.createRequest(req)
  const mockRes = httpMocks.createResponse()
  mockRes.send = (result) => {
    mockRes.res = result
  }
  await func(mockReq, mockRes)
  return { status: mockRes._getStatusCode(), body: mockRes.res }
}

export const oneToOne = (leftList, leftKey, rightList, rightKey, as) => {
  leftList.forEach((left) => {
    const right = rightList.find((right) => right[rightKey] === left[leftKey])
    left[as] = right || null
    delete left[leftKey]
  })
}

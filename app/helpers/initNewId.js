import { format } from 'date-fns/fp'

export default function (userId, time = new Date()) {
  return userId + '_' + format('yyyyMMdd', time)
}

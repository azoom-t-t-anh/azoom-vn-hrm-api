import * as firebase from 'firebase'
import { format } from 'date-fns/fp'

export const project = {
  id: '',
  projectName: '',
  createdUserId: '',
  startDate: '',
  endDate: '',
  status: -1,
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: '',
}

export const leaveApplication = {
  id: '',
  userId: '',
  approvalUserId: '',
  approvalCosre: 0,
  requiredDates: [],
  requiredContent: '',
  status: -1,
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: '',
}

export const timesheetApplication = {
  id: '',
  userId: '',
  approvalUserId: [],
  startTime: '',
  endTime: '',
  requiredDate: '',
  timesheetId: '',
  requiredContent: '',
  approvalCosre: 0,
  status: -1,
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: '',
}

export const timesheet = {
  id: '',
  userId: '',
  startTime: '',
  endTime: '',
  leaveTypeId: '',
  checkedDate: format('yyyy/MM/dd', new Date()),

  isCorrect: false,
}

export const member = {
  id: '',
  name: '',
  isActive: true,
  created: firebase.firestore.Timestamp.fromDate(new Date()),
  updated: '',
  createdUserId: ''
}

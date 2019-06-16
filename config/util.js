import moment from 'moment/moment'

const time = moment()
const date = time.format('MMMM Do YYYY')


export function setLocals(req, res, next) {
  res.locals.year = time.year()
  res.locals.date = date
  res.locals.user = req.user
  res.locals.error = req.flash('error')
  res.locals.message = req.flash('message')
  res.locals.validationErrors = req.flash('validationErrors')
  next()
}
import moment from 'moment/moment'
import { Request, Response, NextFunction } from 'express'
const time = moment()
const date = time.format('MMMM Do YYYY')

/** This function make its possible to set data that is universally available in every template without 
 * having to pass in data via the render method
 */
export function setLocals(req: Request, res: Response, next: NextFunction) {
  res.locals.year = time.year()
  res.locals.date = date
  res.locals.user = req.user
  res.locals.error = req.flash('error')
  res.locals.message = req.flash('message')
  res.locals.validationErrors = req.flash('validationErrors')
  next()
}

export function logger(req: Request, res: Response, next: NextFunction) {
  const durationInMilliseconds = getDurationInMilliseconds(process.hrtime())
  console.info(`${req.method} - ${req.url} - ${durationInMilliseconds.toString()} ms`)
  next()
}

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

export function getUrl(req: Request) {
  return `${req.protocol}://${req.get('host')}`
}
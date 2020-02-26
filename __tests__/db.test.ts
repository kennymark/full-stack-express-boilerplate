import db from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
process.env.NODE_ENV = 'test';

db.connect(process.env.DB_URL as string, { useNewUrlParser: true })

const timeOut = 25000
describe('Test database activities', () => {

  beforeAll(() => {
    // console.log(db.modelNames())
  })

  afterAll(async () => {
    await db.connection.close()
    await db.connection.dropCollection('nothing')
  });

  test('should connection successfully to the db', async () => {
    const dbState = await db.connection.readyState
    expect(dbState).toBe(2)
  }, timeOut)

  test('should disconnect ', async () => {
    await db.connection.close().then(_ => {
      const dbState = db.connection.readyState
      expect(dbState).toBe(0)
    })
  }, timeOut)

  // test('should create a collection', () => {
  //   const models = db.modelNames()
  //   expect(models.length).toBeGreaterThan(1)
  // })

})
import db from 'mongoose'
import dotenv from 'dotenv'
import 'jest'
dotenv.config()
process.env.NODE_ENV = 'test';


const timeOut = 25000
describe('Test database activities', () => {

  beforeAll(() => {
    db.connect(process.env.DB_URL as string, { useNewUrlParser: true })
    // console.log(db.modelNames())
  })

  afterAll(async (done) => {
    await db.connection.close()
    await db.connection.dropCollection('nothing')
    done()
  });

  test('should connection successfully to the db', async (done) => {
    const dbState = await db.connection.readyState
    expect(dbState).toBe(2)
    done()
  }, timeOut)

  test('should disconnect ', async (done) => {
    await db.connection.close().then(_ => {
      const dbState = db.connection.readyState
      expect(dbState).toBe(0)
      done()
    })
  }, timeOut)

  // test('should create a collection', () => {
  //   const models = db.modelNames()
  //   expect(models.length).toBeGreaterThan(1)
  // })

})
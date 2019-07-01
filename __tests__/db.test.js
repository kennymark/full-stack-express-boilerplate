const db = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
process.env.NODE_ENV = 'test';

db.connect(process.env.DB_URL, { useNewUrlParser: true })


describe('Test database activities', () => {

  beforeAll(() => {
    // console.log(db.modelNames())
  })



  // afterAll(async () => {
  //   // await db.connection.close()
  //   await db.connection.dropCollection('nothing')
  // });

  test('should connection successfully to the db', async () => {
    const dbState = await db.connection.readyState
    expect(dbState).toBe(2)
  })

  test('should disconnect ', async () => {
    await db.connection.close().then(_ => {
      const dbState = await db.connection.readyState
      expect(dbState).toBe(0)
    })
  })

  // test('should create a collection', () => {
  //   const models = db.modelNames()
  //   expect(models.length).toBeGreaterThan(1)
  // })

})
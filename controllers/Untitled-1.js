class Promesa {
  constructor(resolve, reject) {
  }

  then(arg) {
    return this
  }

  catch(args) {
    if (args) {
      args()
    }
    return this
  }

}


const prom = new Promesa()

prom.then().then()
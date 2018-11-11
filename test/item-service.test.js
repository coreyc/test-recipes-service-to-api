const chai = require('chai')
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect
chai.use(chaiAsPromised)

describe('Item Service', () => {
  before(async () => {
  })

  afterEach(() => {
    process.env.UNHAPPY = false
  })
})
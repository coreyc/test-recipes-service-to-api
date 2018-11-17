const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const request = require('superagent')

const { booksFixture } = require('./books.fixture')

const { fetchBooks, getBookTitles } = require('../src/book-service')

const expect = chai.expect
chai.use(chaiAsPromised)

describe('Book Service', () => {
  let getRequest
  
  before(() => {
    getRequest = sinon.stub(request, 'get')
  })

  after(() => {
    process.env.UNHAPPY = false
    getRequest.restore()
  })

  describe('fetchBooks', () => {
    it('should return list of books based on search string', async () => {
      getRequest.returns({
        query: sinon.stub().returns(booksFixture)
      })

      const searchResults = await fetchBooks('lord of the rings')
      expect(searchResults).to.deep.equal({
        docs: [
          {title_suggest: 'The Lord of the Rings', cover_edition_key: 'OL9701406M'},
          {title_suggest: 'Lord of the Rings', cover_edition_key: 'OL1532643M'},
          {title_suggest: 'The Fellowship of the Ring', cover_edition_key: 'OL18299598M'}
        ]
      })
    })
  })

  describe('getBookTitles', () => {
    it('should filter down response object to just book titles', () => {
      const titles = getBookTitles(booksFixture.docs)
      expect(titles).to.deep.equal([
        'The Lord of the Rings',
        'Lord of the Rings',
        'The Fellowship of the Ring'
      ])
    })
  })
})
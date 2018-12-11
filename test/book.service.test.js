const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')

const { booksFixture } = require('./books.fixture')

const { fetchBooks, getBookTitles } = require('../src/book.service')

const expect = chai.expect
chai.use(chaiAsPromised)

describe('Book Service', () => {
  describe('fetchBooks', () => {
    it('should return list of books based on search string', async () => {
      nock('http://openlibrary.org')
        .get('/search.json')
        .query(true)
        .reply(200, booksFixture)

      const {body} = await fetchBooks('lord of the rings')
      expect(body).to.deep.equal({
        docs: [
          {title_suggest: 'The Lord of the Rings', cover_edition_key: 'OL9701406M'},
          {title_suggest: 'Lord of the Rings', cover_edition_key: 'OL1532643M'},
          {title_suggest: 'The Fellowship of the Ring', cover_edition_key: 'OL18299598M'}
        ]
      })
    })

    it('should throw an error if the service is down', async () => {
      nock('http://openlibrary.org')
        .get('/search.json')
        .query(true)
        .reply(500)

      await expect(fetchBooks('lord of the rings')).to.be.rejectedWith('Open Library service down')
    })

    it('should return null if query returns a 404', async () => {
      nock('http://openlibrary.org')
        .get('/search.json')
        .query(true)
        .reply(404)

      const response = await fetchBooks('aksdfhkahsdfkhsadkfjhskadjhf')
      expect(response).to.be.null;
    })

    it('should throw an error if there is a problem with the request (i.e. - 401 Unauthorized)', async () => {
      nock('http://openlibrary.org')
        .get('/search.json')
        .query(true)
        .reply(401)

      expect(fetchBooks('lord of the rings')).to.be.rejectedWith('Problem with request')
    })

    it('should throw an error if there is a problem with the request (i.e. - 400 Bad Request)', async () => {
      nock('http://openlibrary.org')
        .get('/search.json')
        .query(true)
        .reply(400)

      await expect(fetchBooks('lord of the rings')).to.be.rejectedWith('Problem with request')
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
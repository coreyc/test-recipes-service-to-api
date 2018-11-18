const request = require('superagent')

const fetchBooks = async (query) => {
  const response = await request
      .get('http://openlibrary.org/search.json')
      .query({ q: query }) // query string

  if (response.status === 404) return null
  if (response.status === 500) throw new Error('Open Library service down')
  if (response.status > 400) throw new Error('Problem with request')
  else return response
}

const getBookTitles = (searchResults) => {
  return searchResults.map(({title_suggest}) => title_suggest)
}

module.exports = {
  fetchBooks,
  getBookTitles
}
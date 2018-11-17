const request = require('superagent')

const fetchBooks = async (query) => {
  return await request
    .get('http://openlibrary.org/search.json')
    .query({ q: query }) // query string
}

const getBookTitles = (searchResults) => {
  return searchResults.map(({title_suggest}) => title_suggest)
}

module.exports = {
  fetchBooks,
  getBookTitles
}
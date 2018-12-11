const request = require('superagent')

const fetchBooks = async (query) => {
  let response
  
  try {
    response = await request
      .get('http://openlibrary.org/search.json')
      .query({ q: query }) // query string
  } catch(e) {
    response = e.status
  }

  if (response === 404) return null
  if (response === 500) throw new Error('Open Library service down')
  if (response >= 400) throw new Error('Problem with request')
  else return response
}

const getBookTitles = (searchResults) => {
  return searchResults.map(({title_suggest}) => title_suggest)
}

module.exports = {
  fetchBooks,
  getBookTitles
}
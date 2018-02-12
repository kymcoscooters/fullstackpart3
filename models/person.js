const mongoose = require('mongoose')

require('dotenv').config()
  
const url = "mongodb://kymcoscooters:tietokanta@ds133558.mlab.com:33558/kymcodb"

mongoose.connect(url)

const Person = mongoose.model('Person', {
	name: String,
	number: String
})

module.exports = Person
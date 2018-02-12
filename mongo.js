const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
	name: String,
	number: String
})

if (process.argv[2]) {
	const person = new Person({
		name: process.argv[2],
		number: process.argv[3]
	})

	person
		.save()
		.then(result => {
			console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
			mongoose.connection.close()
		})
} else {
	Person
	.find({})
	.then(result => {
		console.log('puhelinluettelo:')
		result.forEach(person => { 
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
}
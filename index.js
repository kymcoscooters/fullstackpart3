const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

let personamount = 0

app.use(express.static('build'))

app.use(cors())

app.use(bodyParser.json())

morgan.token('data', function getData (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

const formatPerson = (person) => {
	return {
		name: person.name,
		number: person.number,
		id: person._id
	}
}

app.get('/', (req, res) => {
	res.send('<h1>Terve</h1>')
})

app.get('/api/persons', (req, res) => {
	Person
		.find({})
		.then(persons => {
			personamount = persons.length
			res.json(persons.map(formatPerson))
		})
		.catch(error => {
			console.log(error)
		})
})

app.get('/info', (req, res) => {
	res.send(`puhelinluettelossa ${personamount} henkilön tiedot</br>${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
	Person
		.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(formatPerson(person))
			} else {
				res.status(404).end()
			}
		})
		.catch(error => {
			console.log(error)
			res.status(400).send({error: "malformatted id"})
		})
})

app.post('/api/persons', (req, res) => {
	const body = req.body

	if (body.number === undefined) {
		return res.status(400).json({error: "number missing"})
	}

	if (body.name === undefined) {
		return res.status(400).json({error: "name missing"})
	}

	const person = new Person ({
		name: body.name,
		number: body.number
	})

	person
		.save()
		.then(savedPerson => {
			res.json(formatPerson(savedPerson))
		})
		.catch(error => {
			console.log(error)
		})
})

app.delete('/api/persons/:id', (req, res) => {
	Person
		.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => {
			res.status(400).send({error: "malformatted id"})
		})
})

app.put('/api/persons/:id', (req, res) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person
		.findByIdAndUpdate(req.params.id, person, {new: true})
		.then(updatedPerson => {
			res.json(formatPerson(updatedPerson))
		})
		.catch(error => {
			console.log(error)
		})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

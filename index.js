const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
  {
    "name": "Arto Hellas",
    "number": "123",
    "id": 1
	},
	{
		"name": "Martti Tienari",
		"number": "040-123456",
		"id": 2
	},
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
		"id": 4
  }
]

app.use(express.static('build'))

app.use(cors())

app.use(bodyParser.json())

morgan.token('data', function getData (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

app.get('/', (req, res) => {
	res.send('<h1>Terve</h1>')
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/info', (req, res) => {
	res.send(`puhelinluettelossa ${persons.length} henkilön tiedot</br>${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => person.id === id)

	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.post('/api/persons', (req, res) => {
	const body = req.body

	if (body.number === undefined) {
		return res.status(400).json({error: "number missing"})
	}

	if (body.name === undefined) {
		return res.status(400).json({error: "name missing"})
	}

	if (persons.filter(person => person.name === body.name).length > 0) {
		return res.status(400).json({error: "name already exists"})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: Math.floor((Math.random()*10000) +1)
	}

	persons = persons.concat(person)

	res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)

	res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

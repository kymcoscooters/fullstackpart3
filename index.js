const express = require('express')
const app = express()
const bodyParser = require('body-parser')

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

app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send('<h1>Terve</h1>')
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/info1', (req, res) => {
	const amount = persons.length
	const date = new Date()
	res.write(`puhelinluettelossa ${amount} henkilön tiedot\n`)
	res.write(`${new Date()}`)
	res.end()
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

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)

	res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
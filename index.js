const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('tiny'))
morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':data'))
app.use(cors())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
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

app.get('/', (req, res) => {
  res.send('Welcome!')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  const totalPersons = persons.length
  const response = `<div>Puhelinluettelossa on ${totalPersons} ihmisen tiedot</div>`.concat(`<div>${date}</div>`)
  res.send(response)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  if (!person) {
    res.status(400).json({errors: ['content missing']})
  }
  const errors = validatePerson(person)
  if (errors.length === 0) {
    person.id = Math.floor(Math.random() * 50 +1)
    persons = persons.concat(person)
    res.json(person)
  } else {
    res.status(400).json({ errors })
  }
})

const validatePerson = (person) => {
  const errors = []
  if (!person.name) {
    errors.push('Name cannot be empty')
  }
  if (!person.number) {
    errors.push('Number cannot be empty')
  }
  if (persons.map(p => p.name.toLowerCase()).includes(person.name.toLowerCase())) {
    errors.push(`${person.name} already exists in phonebook`)
  }
  return errors
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

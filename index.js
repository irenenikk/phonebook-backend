const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(morgan('tiny'))
morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':data'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('Welcome!')
})

app.get('/api/persons', (req, res) => {
  Person
  .find({}, {__v: 0})
  .then(persons => {
    res.json(persons.map(formatPerson))
  })
})

app.get('/info', (req, res) => {
  const date = new Date()
  Person
    .count()
    .then(count => {
      const response = `<div>Puhelinluettelossa on ${count} ihmisen tiedot</div>`.concat(`<div>${date}</div>`)
      res.send(response)
    })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person
    .findById(id)
    .then(formatPerson)
    .then(person => res.json(person))
    .catch(e => res.status(404).end())
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person
      .findByIdAndRemove(id)
      .then(p => {
        res.status(204).end()
      })
      .catch(e => res.status(404).end())
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  if (!person) {
    res.status(400).json({errors: ['content missing']})
  }
  const errors = validatePerson(person)
  if (errors.length === 0) {
      const newPerson = new Person(person)
      newPerson
          .save().then(p => {
            res.json(p)
          })
          .catch(e => {
            console.log(e.message)
            res.send(500).end()
          })
  } else {
    res.status(400).json({ errors })
  }
})

app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const updatedPerson = req.body
  Person
    .findByIdAndUpdate(id, updatedPerson, { new: true })
    .then(formatPerson)
    .then(person =>  res.json(person).end())
    .catch(e => res.status(404).end())
})

const validatePerson = (person) => {
  const errors = []
  if (!person.name) {
    errors.push('Name cannot be empty')
  }
  if (!person.number) {
    errors.push('Number cannot be empty')
  }
  Person.find()
        .then(persons => {
          if (persons.map(p => p.name.toLowerCase()).includes(person.name.toLowerCase())) {
            errors.push(`${person.name} already exists in phonebook`)
          }
        })
  return errors
}

const formatPerson = (p) => {
  const formattedPerson = { ...p._doc, id: p._id }
  delete formattedPerson._id
  delete formattedPerson.__v

  return formattedPerson
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

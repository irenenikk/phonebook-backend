const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url);
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: String,
})

const addNewPerson = (name, number) => {
  const person = new Person({
    name,
    number,
  })

  note
  .save()
  .then(response => {
    console.log(`lisätään henkilö ${name} numerolla ${number} luetteloon`)
    mongoose.connection.close()
  })
  .catch(handleError)
}

const printAllPersons = () => {
  Person.find()
  .then(result => {
    if (result.length === 0) {
      console.log('That\'s one empty database')
    }
    console.log('puhelinluettelo:')
    result
      .sort(byName)
      .forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
  .catch(handleError)
}

const handleError = (e) => {
    console.error('Oh no!')
    console.error(e.message)
}

const byName = (p1, p2) => {
  if (!p1.name || !p2.name) {
    return 0
  }
  const n1 = p1.name.toLowerCase()
  const n2 = p2.name.toLowerCase()
  if (n1 > n2) {
    return 1
  }
  if (n2 < n1) {
    return -1
  }
  return 0
}

module.exports = Person

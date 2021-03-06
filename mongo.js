const mongoose = require('mongoose')

const url = 'mongodb://heroku_k63tnmt4:qit154cikmojcck5jahs8o0e2b@ds139067.mlab.com:39067/heroku_k63tnmt4'

const args = process.argv

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

switch (args.length) {
  case 2:
    printAllPersons()
    break
  case 4:
    let name, number
    [, , name, number] = args
    addNewPerson(name, number)
    break
  default:
    console.log('Please enter 2 arguments: <name> <phoneNumber>')
    break
}


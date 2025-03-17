const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// logger
morgan.token('postData', (request) => {
    if (request.method == 'POST') return '' + JSON.stringify(request.body)
    else return ''
})

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :postData'
    )
)

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/info', (request, response) => {
    morgan('test log')
    response.send(`<p>Phonebook has info for ${phonebook.length} people </p> <p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(p => p.id === id)
    
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = phonebook.filter(p => p.id !== id)
    console.log(persons)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const names = phonebook.map(person => person.name)
    if (!body.name){
        return response.status(400).json({'error': 'name is missing'})
    }
    if (!body.number){
        return response.status(400).json({'error': 'number is missing'})
    }
    if (names.includes(body.name)){
        return response.status(400).json({'error': 'name is not unique!'})
    }

    const newPerson = {
        "name": body.name,
        "number": body.number,
        id: Math.random()
    }
    phonebook = phonebook.concat(newPerson)
    response.json(phonebook)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})
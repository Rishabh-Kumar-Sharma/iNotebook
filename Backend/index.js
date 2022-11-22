const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express()
app.use(cors())
const port = 5000 // Note:- 'React' doesn't work on port: 3000

app.use(express.json()); // if we are required to use 'req.body'

// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`iNotebook app listening at http://localhost:${port}`)
})
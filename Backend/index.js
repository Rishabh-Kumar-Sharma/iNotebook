const connectToMongo = require('./db');
const express = require('express')
connectToMongo();

const app = express()
const port = 5000 // Note:- 'React' doesn't work on port: 3000

app.use(express.json()); // if we are required to use 'req.body'

// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
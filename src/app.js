const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bankRouter = require('./routers/banks')

const port = process.env.PORT || 3000
const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')

// Define public directory to serve
app.use(express.static(publicDirectoryPath))

// Define routes
app.use(bankRouter)

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (error, db) => {
    if (error) {
        return console.log('Unable to Connect to Database!')
    }
    console.log('Database is connected!')
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})
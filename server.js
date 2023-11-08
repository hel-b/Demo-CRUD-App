const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const connectionString = process.env.CONNECTION_STRING

MongoClient.connect(connectionString)
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    //sets the view template engine
    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.get('/', (req, res) => {
      db.collection('quotes')
        .find()
        .toArray()
        .then(results => res.render('index.ejs', { quotes: results }))
        .catch('index.ejs', {})
      // res.sendFile(__dirname + '/index.html')
      // res.render('index.ejs', {})
    })
    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then(result => {
          console.log(result)
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    app.put('/quotes', (req, res) => {
      console.log(req.body)
      quotesCollection
        .findOneAndUpdate(
          { name: 'Yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then(result => {
          console.log(result)
          res.json('Success')
        })
        .catch(error => console.log(eroor))
    })
    app.delete('/quotes', (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then(result => {
          res.json(
            result.deletedCount === 0
              ? 'No quote to delete'
              : `Deleted Darth Vader's quote`
          )
        })
        .catch(error => console.error(error))
    })
    app.listen(3000, function () {
      console.log('listening on 3000')
    })
  })
  .catch(error => console.error(error))

const MongoClient = require('mongodb').MongoClient

dtMin = new Date(2015, 06, 01)
dtMax = new Date(2015, 06, 30)

let documents
const url = 'mongodb://localhost:27017/dbDataGovPub'

MongoClient.connect(url, (err, db) => {
  if (err) throw err
  db.collection('licitacao', (err, collection) => {
    cursor = collection.find({
      '$and' : [
        { 'dtEdital' : {'$gte': dtMin }},
        { 'dtEdital' : {'$lte': dtMax }}
      ]
    },{
      '_id': 0,
      'dtEdital': 1,
    }).toArray( (err, docs) => {
      documents = docs
    })
  })
})

const monthEqualTo = (y) => (d) => d['dtEdital'].getMonth() === y
const monthNotEqualTo = (y) => (d) => d['dtEdital'].getMonth() !== y


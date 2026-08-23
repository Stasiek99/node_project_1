require('dotenv').config({ quiet: true });

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?appName=node-complete`;

const mongoConnect = (callback) => {
    MongoClient.connect(MONGODB_URI)
        .then(client => {
            console.log('Connected!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
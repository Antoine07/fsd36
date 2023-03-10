// Connexion persistente à la base MongoDB
import { MongoClient } from 'mongodb'

// Déclaration de la connectionString
const CONNECTION_STRING = "mongodb://root:example@mongo:27017"; // Avec Docker
// const CONNECTION_STRING = 'mongodb://127.0.0.1:27017'; // Installation locale de MongoDB

const client = new MongoClient(CONNECTION_STRING);
let db = null;

export function openDatabase(dbName) {
  return client.connect().then(() => {
    console.log('Connection to MongoDB initialized …');

    db = client.db(dbName);

    return db;
  });
};

export function getCollection(collectionName) {
  console.log(`Retrieving collection ${collectionName} …`);

  return db.collection(collectionName);
};
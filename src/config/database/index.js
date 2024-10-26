import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const { MONGO_URI, MONGODB_DATABASE } = process.env;

if (!MONGO_URI || !MONGODB_DATABASE) {
    throw new Error('Please define MONGO_URI and MONGODB_DATABASE in your .env file');
}

const client = new MongoClient(MONGO_URI,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});
const connect = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(MONGODB_DATABASE);
    }
    catch (err) {
        throw new Error(err);
    }
}

const close = async () => {
    try {
        await client.close();
        console.log('Closed connection');
        return;
    } catch (err) {
        throw new Error(err);
    }
}

const isValidID =  (id) => {  
     return ObjectId.isValid(id) && (new ObjectId(id).toString()) === id;
}

export { connect, close, isValidID };



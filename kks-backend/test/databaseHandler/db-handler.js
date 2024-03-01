import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server'

let mongo 

// Connect to test DB
export const connectDb = async()=>{
    mongo = await MongoMemoryServer.create()
    const uri = mongo.getUri()
    const mongooseOptions={
        useNewUrlParser:true,
        useUnifiedTopology:true,
       
    };
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri,mongooseOptions);
}

// Disconnect and close connection
export const closeDatabase =async()=>{
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongo.stop()
}

//clear the db , remove all data
export const clearDatabase = async()=>{
    await mongoose.connection.dropDatabase()
}
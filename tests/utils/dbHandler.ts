import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer | null = null;

// Connect to the in-memory database.

export const connect = async (): Promise<void> => {
  try {
    // If already connected, do nothing
    if (mongoose.connection.readyState !== 0) {
      return;
    }

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri);
  } catch (err) {
    console.error('Failed to connect to in-memory database', err);
    throw err;
  }
};

// Drop database, close the connection and stop mongod.

export const closeDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (mongod) {
      await mongod.stop();
      mongod = null;
    }
  } catch (err) {
    console.error('Failed to close database', err);
    throw err;
  }
};

// Remove all the data for all db collections.

export const clearDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) return;

    const collections = mongoose.connection.collections;
    const promises = Object.values(collections).map((collection) => collection.deleteMany({}));
    await Promise.all(promises);
  } catch (err) {
    console.error('Failed to clear database collections', err);
    throw err;
  }
};

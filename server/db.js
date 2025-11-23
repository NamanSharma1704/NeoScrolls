import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neo-scrolls';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

const manhwaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  coverUrl: String,
  status: String,
  currentChapter: Number,
  totalChapters: Number,
  rating: Number,
  link: String,
  synopsis: String,
  lastUpdated: String
});

// Prevent model recompilation error in serverless
const Manhwa = mongoose.models.Manhwa || mongoose.model('Manhwa', manhwaSchema);

export { connectDB, Manhwa };

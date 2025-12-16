import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  try {
    const client = await connectToDatabase();
    const db = client.db('barrelborn');
    
    if (req.method === 'GET') {
      const cart = await db.collection('cart').find({}).toArray();
      res.status(200).json(cart);
    } else if (req.method === 'POST') {
      const item = req.body;
      await db.collection('cart').insertOne(item);
      res.status(201).json({ message: 'Item added to cart' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error with cart:', error);
    res.status(500).json({ error: 'Failed to process cart request' });
  }
}

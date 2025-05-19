const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  // Increase timeout options
  mongoServer = await MongoMemoryServer.create({
    instance: {
      debug: true,
      args: ['-v'],
      timeout: 60000
    }
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 60000); // Also increase Jest timeout for this hook

beforeEach(async () => {
  // Clear all collections before each test
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
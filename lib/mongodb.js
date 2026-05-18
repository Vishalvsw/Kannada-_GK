// Mock MongoDB connection - no actual database required
export async function connectToDatabase() {
  console.log('Using mock database - no MongoDB needed');
  return { db: null, isMock: true };
}

export const mongoose = {
  connect: async () => console.log('Mock mongoose'),
  model: () => ({})
};

export default { connectToDatabase };

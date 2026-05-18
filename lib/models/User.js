// Mock User model - no database required
class MockUser {
  constructor(data) {
    Object.assign(this, data);
  }
  
  static async findOne() {
    return null;
  }
  
  static async create(data) {
    return new MockUser(data);
  }
  
  async save() {
    return this;
  }
}

const User = MockUser;
export default User;

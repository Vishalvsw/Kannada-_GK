// Mock Question model - no database required
class MockQuestion {
  static async find() {
    return { sort: () => ({ limit: () => [] }) };
  }
  
  static async create(data) {
    return { ...data, _id: Date.now().toString() };
  }
  
  static async findByIdAndUpdate() {
    return {};
  }
  
  static async findByIdAndDelete() {
    return {};
  }
}

const Question = MockQuestion;
export default Question;

// Mock Note model
class MockNote {
  static async find() {
    return [];
  }
  
  static async create() {
    return {};
  }
}

const Note = MockNote;
export default Note;

// Mock PDF model
class MockPDF {
  static async find() {
    return [];
  }
  
  static async create() {
    return {};
  }
}

const PDF = MockPDF;
export default PDF;

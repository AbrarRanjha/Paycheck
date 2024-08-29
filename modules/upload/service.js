/* eslint-disable no-undef */
import Upload from './model.js';
class uploadService {
  async getuploadById(id) {
    try {
      const upload = await Upload.findByPk(id);
      return upload;
    } catch (error) {
      throw new Error('Failed to get upload: ' + error.message);
    }
  }
}

export default new uploadService(); // Exporting an instance of the class

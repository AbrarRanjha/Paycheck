import saleData from './model.js';
class saleDataService {
  async getsaleDataById(id) {
    try {
      const res = await saleData.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get saleData: ' + error.message);
    }
  }
}

export default new saleDataService(); 
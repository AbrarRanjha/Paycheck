const Validation =require ('./model.js');
class validationService {
  async getValidationById(id) {
    try {
      const res = await Validation.findByPk(id);
      return res;
    } catch (error) {
      throw new Error('Failed to get validation: ' + error.message);
    }
  }
  async getAllValidation(limit, skip) {
    try {
      limit = parseInt(limit, 10);
      skip = parseInt(skip, 10);
      console.log('limit: ' +  limit, skip);

      const res = await Validation.findAll({
        limit: limit,
        offset: skip,
      });
      return res;
    } catch (error) {
      console.log('error', error);

      throw new Error('Failed to get validation: ' + error.message);
    }
  }
}

module.exports =new validationService()

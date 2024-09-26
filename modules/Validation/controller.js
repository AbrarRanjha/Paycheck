const validationService =require ('./service.js');

class ValidationController {
  constructor() {}
  async getValidationById(req, res) {
    try {
      const id = req.params.id;
      const validation = await validationService.getValidationById(id);
      if (validation) {
        res.status(200).json(validation);
      } else {
        res.status(404).json({ error: 'Validation not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getValidation(req, res) {
    try {
      const {limit,skip}=req.query    
      if(!limit||!skip){
        res.status(400).json({ error: 'Limit or skip is undefined' });
      }  
      const validation = await validationService.getAllValidation(limit,skip);
      if (validation) {
        res.status(200).json(validation);
      } else {
        res.status(404).json({ error: 'Validation not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}
module.exports =new ValidationController();
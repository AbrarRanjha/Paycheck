const PayoutService =require ('./service.js');

class PayoutController {
  constructor() {}
  async getPayoutById(req, res) {
    try {
      const id = req.params.id;
      const Payout = await PayoutService.getPayoutById(id);
      if (Payout) {
        res.status(200).json(Payout);
      } else {
        res.status(404).json({ error: 'Payout not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getPayout(req, res) {
    try {
      const {limit,skip}=req.query  
      if(!limit||!skip){
        res.status(400).json({ error: 'Limit or skip is undefined' });
      }    
      const Payout = await PayoutService.getAllPayout(limit,skip);
      if (Payout) {
        res.status(200).json(Payout);
      } else {
        res.status(404).json({ error: 'Payout not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports=new PayoutController();
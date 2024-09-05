const { Router } =require ('express');

const router = Router();

router.get('/', (req, res) => {
  res.json('success');
});

// You can define more routes related to users here
module.exports = router;
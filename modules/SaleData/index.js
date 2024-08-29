import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json('success');
});

// You can define more routes related to users here

export default router;

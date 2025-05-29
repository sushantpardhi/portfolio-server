import { Router } from 'express';
import {
  getPortfolio,
  updatePortfolio,
  createPortfolio,
} from '../controllers/portfolio.controller';
import { validatePortfolio } from '../validation/portfolio.validation';

const router = Router();

router.get('/', getPortfolio);
router.patch('/', updatePortfolio);
router.post('/', validatePortfolio, createPortfolio);

export default router;

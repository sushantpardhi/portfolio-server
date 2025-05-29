import { Router } from 'express';
import {
  getPortfolio,
  updatePortfolio,
  createPortfolio,
} from '../controllers/portfolio.controller';
import { validatePortfolio } from '../validation/portfolio.validation';
import { verifyAuthKey } from '../middleware/verifyAuthKey';

const router = Router();

router.get('/', getPortfolio);
router.patch('/', verifyAuthKey, updatePortfolio);
router.post('/',  validatePortfolio, createPortfolio);

export default router;

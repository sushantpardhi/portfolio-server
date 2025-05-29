import { Router } from 'express';
import {
  getPortfolio,
  updatePortfolio,
  createPortfolio,
} from '../controllers/portfolio.controller';
import { validatePortfolio } from '../validation/portfolio.validation';
import { verifyAuthKey } from '../middleware/auth';

const router = Router();

router.get('/', getPortfolio);
router.patch('/', verifyAuthKey, updatePortfolio);
router.post('/', verifyAuthKey, validatePortfolio, createPortfolio);

export default router;

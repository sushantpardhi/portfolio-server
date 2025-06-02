import { Router, RequestHandler } from "express";
import {
  getPortfolio,
  updatePortfolio,
  createPortfolio,
} from "../controllers/portfolio.controller";
import { validatePortfolio } from "../validation/portfolio.validation";
import { verifyAuthKey } from "../middleware/verifyAuthKey";

const router = Router();

router.get("/", getPortfolio as RequestHandler);
router.patch(
  "/",
  verifyAuthKey as RequestHandler,
  updatePortfolio as RequestHandler
);
router.post(
  "/",
  validatePortfolio as RequestHandler,
  createPortfolio as RequestHandler
);

export default router;

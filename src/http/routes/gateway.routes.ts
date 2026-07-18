import { Router, type Router as ExpressRouter } from 'express';

import * as gatewayController from '../controllers/gateway.controller';

const router: ExpressRouter = Router();

router.get('/health', gatewayController.health);
router.get('/full-health', gatewayController.fullHealth);
router.get('/status', gatewayController.status);
router.get('/livez', gatewayController.livez);
router.get('/readyz', gatewayController.readyz);

export default router;

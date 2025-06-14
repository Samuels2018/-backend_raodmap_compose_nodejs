import { Router } from 'express';
import UrlController  from '../controllers/urlController';
import StatsController from '../controllers/statsController';

const router = Router();

console.log('urlRoutes.ts loaded');

router.post('/shorten', UrlController.createShortUrl);
router.get('/shorten/:shortCode', UrlController.getOriginalUrl);
router.put('/shorten/:shortCode', UrlController.updateUrl);
router.delete('/shorten/:shortCode', UrlController.deleteUrl);
router.get('/shorten/:shortCode/stats', StatsController.getUrlStats);

export default router;
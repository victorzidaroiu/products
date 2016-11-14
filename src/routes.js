import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ silent: true });
/* eslint-disable */
const router = express.Router();
/* eslint-enable */

router.get('/*', (req, res) => {
  res.render('index', { apiEndpoint: process.env.API_ENDPOINT });
});

export default router;

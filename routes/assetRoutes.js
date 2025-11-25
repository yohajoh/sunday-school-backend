import express from 'express';
import { getAssets, createAsset } from '../controllers/assetController.js';

const assetRouter = express.Router();

assetRouter.route('/').get(getAssets).post(createAsset);

export default assetRouter;

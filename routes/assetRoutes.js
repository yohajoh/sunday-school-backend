import express from 'express';
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from '../controllers/assetController.js';

const assetRouter = express.Router();

assetRouter.route('/').get(getAssets).post(createAsset);
assetRouter.route('/:id').put(updateAsset).delete(deleteAsset);

export default assetRouter;

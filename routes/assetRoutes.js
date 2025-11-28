import express from 'express';
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from '../controllers/assetController.js';
import { protect } from '../middleware/auth.js';

const assetRouter = express.Router();

assetRouter.route('/').get(getAssets);

assetRouter.use(protect);

assetRouter.route('/').post(createAsset);
assetRouter.route('/:id').put(updateAsset).delete(deleteAsset);

export default assetRouter;

import Asset from '../models/assetModel.js';

export const getAssets = async (req, res, next) => {
  try {
    const data = await Asset.find().populate('assignedTo', 'firstName email');
    res.status(200).json({
      status: 'success',
      results: data.length,
      data: {
        data,
      },
    });
  } catch (err) {
    console.log('Error:', err.message);
    next(err);
  }
};

export const createAsset = async (req, res, next) => {
  try {
    const data = await Asset.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data,
      },
    });
  } catch (err) {
    console.log('Error:', err.message);
    next(err);
  }
};

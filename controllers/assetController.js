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

export const updateAsset = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;

    const data = await Asset.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    res.status(200).json({
      success: 'success',
      data: data,
    });
  } catch (err) {
    console.log('Error:', err.message);
    next(err);
  }
};

export const deleteAsset = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deleted = await Asset.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

import User from '../models/userModel.js';

export const getUser = async (req, res, next) => {
  try {
    const data = await User.find();
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

export const createUser = async (req, res, next) => {
  try {
    const data = await User.create(req.body);
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

export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;

    const data = await User.findByIdAndUpdate(id, update, {
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

export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deleted = await User.findByIdAndDelete(id);

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

import User from '../models/userModel.js';

export const getUser = async (req, res) => {
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
  }
};

export const createUser = async (req, res) => {
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
  }
};

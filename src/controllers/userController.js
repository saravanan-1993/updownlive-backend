import User from '../models/User.js';

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { verifiedStatus: status }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `User status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, phone, address, city, state, zipcode, country } = req.body;

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipcode !== undefined) updateData.zipcode = zipcode;
    if (country !== undefined) updateData.country = country;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

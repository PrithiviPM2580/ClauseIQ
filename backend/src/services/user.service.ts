import { deleteUser, findUserByIdLean, updateUser } from '@/dao/user.dao';
import logger from '@/lib/logger.lib';
import { UpdateUserBody } from '@/validation/user.validation';
import { Types } from 'mongoose';

export const getUserService = async (userId: Types.ObjectId) => {
  const user = await findUserByIdLean(userId);
  if (!user) {
    logger.error(`User with ID ${userId} not found`);
    throw new Error('User not found');
  }
  return user;
};

export const updateUserService = async (
  data: UpdateUserBody,
  userId: Types.ObjectId
) => {
  const { displayName, profilePicture } = data;

  const updatedUser = await updateUser(userId, { displayName, profilePicture });

  if (!updatedUser) {
    logger.error(`User with ID ${userId} not found for update`);
    throw new Error('User not found for update');
  }
  return updateUser;
};

export const deleteUserService = async (userId: Types.ObjectId) => {
  const deletedUser = await deleteUser(userId);
  if (!deletedUser) {
    logger.error(`User with ID ${userId} not found for deletion`);
    throw new Error('User not found for deletion');
  }
  return deletedUser;
};

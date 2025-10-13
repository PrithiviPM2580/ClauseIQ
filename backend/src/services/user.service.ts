import { findUserByIdLean } from '@/dao/user.dao';
import logger from '@/lib/logger.lib';
import { Types } from 'mongoose';

export const getUserService = async (userId: Types.ObjectId) => {
  const user = await findUserByIdLean(userId);
  if (!user) {
    logger.error(`User with ID ${userId} not found`);
    throw new Error('User not found');
  }
  return user;
};

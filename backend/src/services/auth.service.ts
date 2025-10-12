import {
  createToken,
  createUser,
  isUserByEmailOrUsernameExist,
} from '@/dao/user.dao';
import { APIError } from '@/lib/apiError.lib';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt.lib';
import logger from '@/lib/logger.lib';
import { generateMongooseId } from '@/utils';
import { Register } from '@/validation/auth.validation';

export const signUpService = async (data: Register) => {
  const { email, username, password } = data;

  const isUsernameAndEmailExist = await isUserByEmailOrUsernameExist(
    email,
    username
  );

  if (isUsernameAndEmailExist) {
    logger.warn(
      `User already exists with email: ${email} or username: ${username}`
    );
    throw new APIError(
      409,
      'User already exists with provided email or username'
    );
  }

  const userId = generateMongooseId();
  const user = await createUser({
    _id: userId,
    email,
    username,
    password,
  });

  const refreshToken = generateRefreshToken({ userId });
  const accessToken = generateAccessToken({ userId });

  await createToken({
    token: refreshToken,
    user: userId,
  });

  return {
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    accessToken,
    refreshToken,
  };
};

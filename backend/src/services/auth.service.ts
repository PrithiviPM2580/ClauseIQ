import { TokenPayload } from '@/@types';
import {
  clearRefreshToken,
  createGoogleUser,
  createToken,
  createUser,
  deleteToken,
  findOne,
  findUserByEmailOrUsername,
  findUserByGoogleId,
  isUserByEmailOrUsernameExist,
  tokenExists,
} from '@/dao/user.dao';
import { APIError } from '@/lib/apiError.lib';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/lib/jwt.lib';
import logger from '@/lib/logger.lib';
import { generateMongooseId } from '@/utils';
import { Google, Login, Register } from '@/validation/auth.validation';
import { Types } from 'mongoose';

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

export const loginService = async (data: Login) => {
  const { identifier, password } = data;

  const user = await findUserByEmailOrUsername(identifier);

  if (!user) {
    logger.warn(`No user found with identifier: ${identifier}`);
    throw new APIError(404, 'Invalid user credentials');
  }

  if (!user.comparePassword) {
    throw new APIError(500, 'User authentication method not available');
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    logger.warn(`Invalid password for user: ${identifier}`);
    throw new APIError(404, 'Invalid user credentials');
  }

  const userId = user._id;
  const refreshToken = generateRefreshToken({ userId });
  const accessToken = generateAccessToken({ userId });

  await createToken({
    token: refreshToken,
    user: user._id,
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

export const logoutService = async (
  userId?: Types.ObjectId
): Promise<boolean> => {
  if (!userId) {
    logger.warn('No userId provided for logout');
    throw new APIError(400, 'UserId is required for logout');
  }

  console.log('Attempting to clear refresh token for userId:', userId);
  const isRefreshTokenCleared = await clearRefreshToken(userId);
  console.log('Clear refresh token result:', isRefreshTokenCleared);

  if (!isRefreshTokenCleared.acknowledged) {
    logger.error(`Failed to clear refresh token for userId: ${userId}`);
    throw new APIError(500, 'Failed to logout user');
  }

  logger.info(`Successfully cleared refresh token for userId: ${userId}`);
  return true;
};

export const googleVerifyService = async (data: Google) => {
  const { email, displayName, profilePicture, googleId } = data;

  // 1. Check if user already linked with Google ID
  let user = await findUserByGoogleId(googleId);
  if (user) return user;

  // 2. Check if user exists by email (previous signup)
  if (email) {
    user = await findOne(email);
    if (user) {
      user.googleId = googleId;
      await user.save();
      return user;
    }
  }

  // 3. Otherwise create new Google user
  const newUser = await createGoogleUser({
    email,
    googleId,
    displayName,
    profilePicture,
  });

  return newUser;
};

export const googleService = async (user: TokenPayload) => {
  const { userId } = user;

  if (!user || !userId) {
    logger.error('Google authentication failed: No userId in token payload');
    throw new APIError(401, 'Authentication failed');
  }

  const accessToken = generateAccessToken({ userId });
  const refreshToken = generateRefreshToken({ userId });

  await createToken({
    token: refreshToken,
    user: userId,
  });
  return {
    userId,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (token: string) => {
  const jwtPayload = verifyRefreshToken(token) as TokenPayload;

  const isTokenExists = await tokenExists(token);
  if (!isTokenExists) {
    throw new APIError(401, 'Invalid refresh token');
  }

  const newAccessToken = generateAccessToken({ userId: jwtPayload.userId });
  const newRefreshToken = generateRefreshToken({ userId: jwtPayload.userId });

  await deleteToken(newRefreshToken);
  await createToken({
    token: newRefreshToken,
    user: new Types.ObjectId(jwtPayload.userId),
  });

  return { newAccessToken, newRefreshToken };
};

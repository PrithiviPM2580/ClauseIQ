import { UserDocument } from '@/models/user.model';
import UserModel from '@/models/user.model';
import { CreateUser } from '@/@types';
import TokenModel, { IToken } from '@/models/token.model';
import { Types } from 'mongoose';
import { Google } from '@/validation/auth.validation';
import { UpdateUserBody } from '@/validation/user.validation';

export const createUser = async (
  userdata: CreateUser
): Promise<UserDocument> => {
  return await UserModel.create(userdata);
};

export const findUserByEmailOrUsername = async (
  identifier?: string
): Promise<UserDocument | null> => {
  return UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select('+password');
};

export const isUserByEmailOrUsernameExist = async (
  email: string,
  username?: string
): Promise<boolean> => {
  const exist = await UserModel.exists({
    $or: [{ email }, ...(username ? [{ username }] : [])],
  });
  return exist !== null;
};

export const createToken = async (data: IToken) => {
  return await TokenModel.create(data);
};

export const clearRefreshToken = async (userId?: Types.ObjectId) => {
  return await TokenModel.deleteOne({ user: userId });
};

export const findUserByGoogleId = async (
  googleId?: string
): Promise<UserDocument | null> => {
  return UserModel.findOne({ googleId }).select('+password');
};

export const findOne = async (email: string): Promise<UserDocument | null> => {
  return UserModel.findOne({ email });
};

export const createGoogleUser = async (
  userData: Google
): Promise<UserDocument> => {
  return await UserModel.create(userData);
};

export const tokenExists = async (token: string): Promise<boolean> => {
  const exist = await TokenModel.exists({ token }).lean();
  return exist !== null;
};

export const deleteToken = async (token: string): Promise<boolean> => {
  const result = await TokenModel.deleteOne({ token });
  return result.deletedCount > 0;
};

export const findUserByIdLean = async (userId: Types.ObjectId) => {
  return await UserModel.findById(userId).lean();
};

export const updateUser = (userId: Types.ObjectId, data: UpdateUserBody) => {
  return UserModel.findByIdAndUpdate(userId, data, { new: true });
};

export const deleteUser = async (userId: Types.ObjectId) => {
  return await UserModel.findByIdAndDelete(userId);
};

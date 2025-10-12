import { UserDocument } from '@/models/user.model';
import UserModel from '@/models/user.model';
import { CreateUser } from '@/@types';
import TokenModel, { IToken } from '@/models/token.model';

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

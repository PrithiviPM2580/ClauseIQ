import mongoose, { Schema, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  username?: string;
  email: string;
  password?: string;
  googleId?: string;
  displayName?: string;
  profilePicture?: string;
  isPremium: boolean;
}

export type UserDocument = HydratedDocument<IUser>;
export type UserObject = IUser & { _id: mongoose.Types.ObjectId };

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      maxLength: [50, 'Username cannot exceed 50 characters'],
      minLength: [3, 'Username must be at least 3 characters long'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: [6, 'Password must be at least 6 characters long'],
      trim: true,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    displayName: {
      type: String,
      maxLength: [100, 'Display name cannot exceed 100 characters'],
      trim: true,
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (
  enteredPassword?: string
): Promise<boolean> {
  if (!this.password || !enteredPassword) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;

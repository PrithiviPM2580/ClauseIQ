import mongoose, { Schema } from 'mongoose';
import type { Types } from 'mongoose';

export interface IToken {
  token: string;
  user?: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const TokenModel = mongoose.model<IToken>('Token', tokenSchema);

export default TokenModel;

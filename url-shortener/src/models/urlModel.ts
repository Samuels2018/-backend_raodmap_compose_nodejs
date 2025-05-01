import { Schema, model, Document } from 'mongoose';

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  accessCount: number;
}

const urlSchema = new Schema<IUrl>(
  {
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    accessCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

urlSchema.index({ shortCode: 1 }, { unique: true });

export const Url = model<IUrl>('Url', urlSchema);
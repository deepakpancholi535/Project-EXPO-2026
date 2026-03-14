import mongoose, { Document, Schema } from "mongoose";

interface IScoreBreakdown {
  taskScore: number;
  quizScore: number;
  gameScore: number;
}

export interface IResult extends Document {
  userId: mongoose.Types.ObjectId;
  careerId: mongoose.Types.ObjectId;
  score: number;
  strengths: string[];
  weakness: string[];
  breakdown: IScoreBreakdown;
  suggestedCareers: string[];
  createdAt: Date;
  updatedAt: Date;
}

const breakdownSchema = new Schema<IScoreBreakdown>(
  {
    taskScore: { type: Number, required: true },
    quizScore: { type: Number, required: true },
    gameScore: { type: Number, required: true }
  },
  { _id: false }
);

const resultSchema = new Schema<IResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    careerId: {
      type: Schema.Types.ObjectId,
      ref: "Career",
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    strengths: {
      type: [String],
      default: []
    },
    weakness: {
      type: [String],
      default: []
    },
    breakdown: {
      type: breakdownSchema,
      required: true
    },
    suggestedCareers: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export const Result = mongoose.model<IResult>("Result", resultSchema);

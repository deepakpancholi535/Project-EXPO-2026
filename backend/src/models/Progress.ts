import mongoose, { Document, Schema } from "mongoose";

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  careerId: mongoose.Types.ObjectId;
  currentDay: number;
  completedDays: number[];
  taskScore: number;
  quizScore: number;
  gameScore: number;
  status: "in_progress" | "completed";
  updatedAt: Date;
  createdAt: Date;
}

const progressSchema = new Schema<IProgress>(
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
    currentDay: {
      type: Number,
      default: 1
    },
    completedDays: {
      type: [Number],
      default: []
    },
    taskScore: {
      type: Number,
      default: 0
    },
    quizScore: {
      type: Number,
      default: 0
    },
    gameScore: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress"
    }
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, careerId: 1 }, { unique: true });

export const Progress = mongoose.model<IProgress>("Progress", progressSchema);

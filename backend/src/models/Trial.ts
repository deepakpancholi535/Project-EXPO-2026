import mongoose, { Document, Schema } from "mongoose";

export type TrialStepType = "lesson" | "task" | "game" | "quiz" | "project";

export interface ITrialStep {
  day: number;
  title: string;
  type: TrialStepType;
  content: string;
  gameKey?: string;
  options?: string[];
  answer?: string;
}

export interface ITrial extends Document {
  careerId: mongoose.Types.ObjectId;
  tasks: ITrialStep[];
  createdAt: Date;
  updatedAt: Date;
}

const trialStepSchema = new Schema<ITrialStep>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["lesson", "task", "game", "quiz", "project"]
    },
    content: { type: String, required: true },
    gameKey: { type: String },
    options: [{ type: String }],
    answer: { type: String }
  },
  { _id: false }
);

const trialSchema = new Schema<ITrial>(
  {
    careerId: {
      type: Schema.Types.ObjectId,
      ref: "Career",
      required: true,
      unique: true
    },
    tasks: {
      type: [trialStepSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const Trial = mongoose.model<ITrial>("Trial", trialSchema);

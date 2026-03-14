import mongoose, { Document, Schema } from "mongoose";

export type CareerDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ICareer extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: CareerDifficulty;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const careerSchema = new Schema<ICareer>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true
    },
    icon: {
      type: String,
      default: "Briefcase"
    }
  },
  { timestamps: true }
);

export const Career = mongoose.model<ICareer>("Career", careerSchema);

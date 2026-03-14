import { Career } from "../models/Career";
import { Trial } from "../models/Trial";
import { careerSeeds, trialSeedsBySlug } from "../data/seedData";

export const seedInitialData = async (): Promise<void> => {
  const existingCareers = await Career.find();

  if (existingCareers.length === 0) {
    const created = await Career.insertMany(careerSeeds);

    for (const career of created) {
      const tasks = trialSeedsBySlug[career.slug] ?? [];
      await Trial.create({
        careerId: career._id,
        tasks
      });
    }
    // eslint-disable-next-line no-console
    console.log("Seeded careers and trials");
    return;
  }

  for (const career of existingCareers) {
    const trialExists = await Trial.findOne({ careerId: career._id });
    if (!trialExists) {
      await Trial.create({
        careerId: career._id,
        tasks: trialSeedsBySlug[career.slug] ?? []
      });
    }
  }
};

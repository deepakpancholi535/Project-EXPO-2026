import app from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { seedInitialData } from "./services/seedService";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await seedInitialData();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`TAC API running on http://localhost:${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to boot server", error);
    process.exit(1);
  }
};

void startServer();

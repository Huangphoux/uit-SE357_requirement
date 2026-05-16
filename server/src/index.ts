if (process.env.NODE_ENV !== "production") {
  require("tsconfig-paths/register");
}

require("dotenv/config");

async function bootstrap() {
  const { seedDatabase } = require("db/seed");
  const { default: App } = require("app");
  const { connectRedis } = require("middlewares/redis");

  // Seed database if needed
  try {
    await seedDatabase();
  } catch (seedError) {
    console.error("Warning: Database seeding failed", seedError);
    // Continue anyway - seeding is optional
  }

  await connectRedis();

  const app = new App();
  app.start();
}

bootstrap().catch((error) => {
  console.error("Failed to start application", error);
  process.exit(1);
});

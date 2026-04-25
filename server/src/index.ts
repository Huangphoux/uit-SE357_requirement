if (process.env.NODE_ENV !== "production") {
	require("tsconfig-paths/register");
}

require("dotenv/config");

async function bootstrap() {
	const { default: App } = require("app");
	const { connectRedis } = require("middlewares/redis");

	await connectRedis();

	const app = new App();
	app.start();
}

bootstrap().catch((error) => {
	console.error("Failed to start application", error);
	process.exit(1);
});

const appConfig = {
  host: process.env.APP_HOST || "0.0.0.0",
  port: parseInt(process.env.APP_PORT || "8000", 10),
};

export default appConfig;

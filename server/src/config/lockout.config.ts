const lockoutConfig = {
  maxAttempts: process.env.MAX_LOGIN_ATTEMPTS as string,

  lockoutTime: process.env.LOCKOUT_TIME_MS as string,
};

export default lockoutConfig;

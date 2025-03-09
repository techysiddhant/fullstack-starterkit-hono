import { Cluster } from "ioredis";

export const redis = new Cluster(
  [
    {
      host: process.env.REDIS_HOST!,
      port: 6379,
    },
  ],
  {
    redisOptions: {
      tls: { checkServerIdentity: () => undefined },
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      showFriendlyErrorStack: true,
    },
    slotsRefreshTimeout: 30000,
    dnsLookup: (address, callback) => callback(null, address),
  }
);

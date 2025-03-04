export type Env = {
  Bindings: {
    DB: D1Database;
    ORIGIN_URL: string;
  };
};

export interface UserAuth {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}
export interface SessionAuth {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null | undefined;
  userAgent?: string | null | undefined;
  userId: string;
}

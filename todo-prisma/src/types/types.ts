export type AuthPayload = {
  id: number;
};

type AuthenticatedUser = {
  id: number;
  username: string;
  age: number | null;
};

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}

import type { AuthenticatedAdmin } from '../../common/types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedAdmin;
    }
  }
}

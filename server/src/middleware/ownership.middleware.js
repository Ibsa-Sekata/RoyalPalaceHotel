import { ApiError } from "../utils/apiError.js";

export function requireOwnership(getOwnerId) {
  return async (req, _res, next) => {
    try {
      if (!req.user) return next(ApiError.unauthorized());
      if (req.user.role === "ADMIN") return next();

      const ownerId = await getOwnerId(req);
      if (Number(ownerId) !== Number(req.user.id)) {
        return next(ApiError.forbidden("You do not own this resource"));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
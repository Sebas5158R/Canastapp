import jwt from "jsonwebtoken";

const getTokenFromHeader = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const normalizeUserFromPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (payload.user && typeof payload.user === "object") {
    return payload.user;
  }

  return payload;
};

export const authenticateJWT = (req, res, next) => {
  const token = getTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Token no enviado" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET no está configurado" });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = normalizeUserFromPayload(payload);
    req.token = token;
    req.tokenPayload = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

import { verifyToken as verifyJwt } from '../utils/jwt.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Tidak ada token' });

  try {
    const user = verifyJwt(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token tidak valid' });
  }
};

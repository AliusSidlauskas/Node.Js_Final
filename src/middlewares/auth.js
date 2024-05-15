import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Bad authorization" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Bad authorization" });
    }

    req.body.userId = decoded.userId;

    return next();
  });
};
export default auth
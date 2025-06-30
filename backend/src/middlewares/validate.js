export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); 
    next();
  } catch (err) {
    const errorMessages = err.errors.map((e) => e.message);
    return res.status(400).json({ errors: errorMessages });
  }
};

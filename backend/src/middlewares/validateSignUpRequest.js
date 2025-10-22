export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ messages: messages });
    }
    next();
  };
};

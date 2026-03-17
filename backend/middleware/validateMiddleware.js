const validate = (schema) => {

  // safety check
  if (!schema || typeof schema.parse !== "function") {
    throw new Error("Invalid schema passed to validate middleware");
  }

  return (req, res, next) => {

    try {

      schema.parse(req.body);

      next();

    } catch (error) {

      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues || error.errors || error.message
      });

    }

  };

};

module.exports = validate;
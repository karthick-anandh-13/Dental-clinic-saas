const { z } = require("zod");

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be valid"),
  age: z.number().int().positive(),
  address: z.string().min(3)
});

module.exports = patientSchema;
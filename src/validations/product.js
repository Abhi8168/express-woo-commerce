const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().positive().required(),
  imageUrl: Joi.string().uri().allow("").optional(),

  status: Joi.string()
    .valid("Created Locally", "Synced", "Sync Failed")
    .optional(), // Since there's a default in Mongoose, it's optional here
});

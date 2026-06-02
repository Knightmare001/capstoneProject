import Joi from "joi";

export const loginAuthenticationPayloadSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
export const signupAuthenticationPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

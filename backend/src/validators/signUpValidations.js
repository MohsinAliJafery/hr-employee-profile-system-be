import Joi from 'joi';

export const signUpSchema = Joi.object({
  firstName: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 3 characters.',
    'any.required': 'Name is required.',
  }),

  companyName: Joi.string().min(3).max(500).required().messages({
    'string.empty': 'Company Name is required.',
    'string.min': 'Company name must be at least 3 characters.',
    'any.required': 'Company Name is required.',
  }),

  mobileNumber: Joi.string().required().messages({
    'string.empty': 'Mobile number is required.',
    'any.required': 'Mobile number is required.',
  }),

  companyEmailId: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is required.',
  }),

  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters.',
    'any.required': 'Password is required.',
  }),

  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match.',
    'any.required': 'Confirm Password is required.',
  }),

  address: Joi.string().required().messages({
    'string.empty': 'Company address is required.',
    'any.required': 'Company address is required.',
  }),
});

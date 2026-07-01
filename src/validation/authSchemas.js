import Joi from 'joi';

const passwordRule = Joi.string()
  .min(8)
  .pattern(/[A-Z]/)
  .pattern(/[0-9]/)
  .required()
  .messages({
    'string.empty': 'Le mot de passe est requis',
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule et un chiffre',
  });

const emailRule = Joi.string()
  .trim()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.empty': "L'email est requis",
    'string.email': 'Email invalide',
  });

export const loginSchema = Joi.object({
  email: emailRule,
  password: Joi.string().required().messages({
    'string.empty': 'Le mot de passe est requis',
  }),
});

export const registerSchema = Joi.object({
  email: emailRule,
  password: passwordRule,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Les mots de passe ne correspondent pas',
      'string.empty': 'Merci de confirmer le mot de passe',
    }),
});

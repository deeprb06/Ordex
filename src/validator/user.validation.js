import Joi from 'joi';

export const signUp = Joi.object({
    full_name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    birth_date: Joi.required(),
    preferences : Joi.array()
});

export const signIn = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});

export const activate = Joi.object({
    email: Joi.string().min(6).required(),
    activation_hash: Joi.string().required()
});

export const resendActivateLink = Joi.object({
    email: Joi.string().min(6).required()
});
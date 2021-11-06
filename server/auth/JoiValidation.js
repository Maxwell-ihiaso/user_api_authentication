const Joi = require('joi');

const authUserSchema = Joi.object({
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().min(6).required()
})

module.exports = {
    authUserSchema
}
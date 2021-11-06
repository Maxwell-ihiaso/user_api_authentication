const createError = require('http-errors');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
} = require('../auth/jwtHelper')
const User = require('../models/UserModel')
const { authUserSchema } = require('../auth/JoiValidation')

const registerHandler = async (req, res, next) => {
    try {
        const { email, password } = await authUserSchema.validateAsync(req.body);
        const isExistingUser = await User.findOne({email})
        if(isExistingUser) throw createError.Conflict(`${email} is already existing!`)
        
        const user = new User({email, password})
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)
        res.status(200).json({accessToken, refreshToken})      
    } catch (error) {
       if (error.isJoi) error.status = 422;
       next(error) 
    }
}

const loginHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { aud: userid } = req.payload
        const isExistingUser = await User.findOne({email})
        if (!isExistingUser) throw createError.Unauthorized(`${email} is not registered`)
        const isCorrectPassword = await isExistingUser.isValidPassword(password)
        if(!isCorrectPassword) throw createError.Unauthorized(`Username/ Password is incorrect`)
        if(isExistingUser.id != userid) throw createError.Unauthorized("token does not match user.")
        res.status(200).json({
            status: "success",
            isLoggedIn: true
        }) // users should be redirected to their dashboards
        
    } catch (error) {
        next (error)
    }
}

module.exports = { 
    registerHandler,
    loginHandler
}
import Joi from 'joi' ; 




 const REGISTER = Joi.object({
     name: Joi.string().max(20).min(6).required() , 
     email: Joi.string().email().required() , 
     password: Joi.string().required() , 
     confirmPassword: Joi.string().required().valid(Joi.ref('password')) , 
     role: Joi.string().valid('ADMIN', 'USER').required() 
})

 const LOGIN = Joi.object({
     email: Joi.string().email().required() , 
     password: Joi.string().required() 
})

export default { LOGIN , REGISTER }
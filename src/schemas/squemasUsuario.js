const Joi = require("joi");


const schemaUsuario = Joi.object({
    nome:Joi.string().required().pattern(/^[a-z,A-Z]/).trim().messages({
        "any.required":"Nome é obrigatório",
        "string.empty":"O campo Nome é obrigatório",
        "string.base":"O campo Nome deve conter texto válido",
        "string.pattern.base":"O campo Nome deve conter apenas letras"
    }),
    email:Joi.string().required().email().trim().messages({
        "any.required":"Email é obrigatório",
        "string.empty":"O campo Email é  obrigatório",
        "string.base":"O campo Email deve conter texto válido",
        "string.email":"O campo Email deve conter apenas letras" 
    }),
    senha: Joi.string().required().min(6).trim().messages({
        "string.min":"O campo Senha deve conter no mínimo 6 caracteres",
        "any.required":"Senha é obrigatório",
        "string.empty":"O campo Senha é obrigatório",
        "string.base":"O campo Senha deve conter texto válido"
    }),
})

const schemaLoginUsuario = Joi.object({
  
    email:Joi.string().required().email().trim().messages({
        "any.required":"Email é obrigatório",
        "string.empty":"O campo Email é  obrigatório",
        "string.base":"O campo Email deve conter um email válido",
        "string.email":"O campo Email deve conter um email válido " 
    }),
    senha: Joi.string().required().trim().messages({
       
        "any.required":"Senha é obrigatório",
        "string.empty":"O campo Senha é obrigatório",
        "string.base":"O campo Senha deve conter texto válido"
    }),
})

module.exports ={
 schemaUsuario,
 schemaLoginUsuario
}
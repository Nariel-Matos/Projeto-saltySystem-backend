const express = require("express");
const {cadastrarUsuario, loginUsuario, logicaRobo} = require("../controladores")
const {validarSchema, autenticacao} = require("../../intermediarios/intermediario");
const { schemaUsuario } = require("../../schemas/squemasUsuario");
const {schemaLoginUsuario} = require("../../schemas/squemasUsuario")



const rota = express.Router();
 

rota.post("/usuario",validarSchema(schemaUsuario),cadastrarUsuario);
rota.post("/login",validarSchema(schemaLoginUsuario),loginUsuario)
rota.use(autenticacao)

rota.post("/message",logicaRobo)

module.exports = rota;
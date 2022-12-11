//importações
const express = require("express");
const {cadastrarUsuario, loginUsuario, logicaRobo, cadastrarContato, listarContato, deletarContato} = require("../controladores")
const {validarSchema, autenticacao} = require("../../intermediarios/intermediario");
const { schemaUsuario, schemaContatos } = require("../../schemas/squemasUsuario");
const {schemaLoginUsuario} = require("../../schemas/squemasUsuario")



const rota = express.Router();
 
//Rotas
rota.post("/usuario",validarSchema(schemaUsuario),cadastrarUsuario);
rota.post("/login",validarSchema(schemaLoginUsuario),loginUsuario)
rota.use(autenticacao)
rota.post("/contato",validarSchema(schemaContatos),cadastrarContato)
rota.post("/message",logicaRobo)
rota.get("/contato",listarContato)
rota.delete("/contato/:id",deletarContato)


module.exports = rota;
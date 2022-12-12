const pool = require('../../src/controladores/api/conexao');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const senhaJwt = require("../segredo/segredo");

const cadastrarUsuario = async (req,res)=>{
 const {nome,email,senha} = req.body;
    try {
     const queryVerific = await pool.query(`select * from usuarios where email = $1`,[email])
      if(queryVerific.rowCount > 0){
        return res.status(400).json({mensagem:`E-mail já cadastrado`});
      }

      const passCriptografy = await bcrypt.hash(senha, 10)

      const queryDeCadastro = `insert into usuarios (nome,email,senha) values ($1,$2,$3) returning *`

      const {rows} = await pool.query(queryDeCadastro, [nome, email,passCriptografy]);

      const { senha: _, ...usuario } = rows[0]

      await pool.query(`insert into contatos(nome,email,usuario_id,contato_id) values($1,$2,$3,$4) returning *`,["Robo SaltSystem",`Olá, bem vindo!`,usuario.id,1])


      return res.status(201).json(usuario)

    } catch (error) {
        console.log(error)
        return res.json({mensagem:"Erro interno do servidor"})}
    }


const loginUsuario = async (req,res)=>{
  const { email, senha } = req.body

  try {
      const { rows, rowCount } = await pool.query("select * from usuarios where email = $1", [email])
      if (rowCount === 0) {
          return res.status(400).json({ mensagem: "usuário e/ou  ou senha inválidos" })
      }
      const { senha: senhaUsuario, ...usuario } = rows[0]
      const verificarSenha = await bcrypt.compare(senha, senhaUsuario);

      if (!verificarSenha) {
          return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." })
      }
      const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: "8h" })
      return res.json({
          usuario,
          token
      })
  }
  catch (error) {
      return res.json({ mensagem: "erro interno do servidor" })
  }
}

const cadastrarContato = async (req,res) => {
const {nome,email} = req.body;
const {id} = req.usuario;

try {
const queryVerificarEmail = await pool.query(`select * from usuarios where email = $1 `,[email])

if(queryVerificarEmail.rowCount == 0){
  return res.status(400).json({mensagem:`Esse usuário ainda não utiliza nossa plataforma.`});
}
const queryVerificarContato = await pool.query(`select * from contatos where email = $1 and usuario_id = $2 `,[email,id])
if(queryVerificarContato.rowCount > 0){
    return res.status(400).json({mensagem:`Contato já existente`})
}
const adicionarContato = await pool.query(`insert into contatos(nome,email,usuario_id,contato_id) values($1,$2,$3,$4) returning *`,[nome,email,id,queryVerificarEmail.rows[0].id],)

return res.status(200).json(adicionarContato.rows)
} 
catch (error) {
  return res.status(400).json({mensagem:error.message})
}
}

const listarContato = async(req,res) => {
  const {id} = req.usuario;

  try {
    try {
      const selecionarContatos = await pool.query("select *  from contatos where usuario_id = $1", [id])
      return res.status(200).json(selecionarContatos.rows)
  } catch (error) {
      return res.status(400).json({ mensagem: "erro interno do servidor" })
  }
  }
   catch (error) {
    return res.status(400).json({mensagem:error.message})
  }
}

const deletarContato = async (req,res) => {
  const { id } = req.params
  const idUsuario = req.usuario.id

  try {
      const verificarContato = await pool.query("select * from contatos where id = $1 and usuario_id = $2", [Number(id), idUsuario])
      if (verificarContato.rowCount < 1) {
          return res.status(404).json({ mensagem: "Contato não encontrado." })
      }
      const deletarContato = await pool.query("delete from contatos where id = $1 and usuario_id = $2", [Number(id), idUsuario])
      return res.status(204).json(deletarContato.rowCount)
  } catch (error) 
  {
    return res.status(400).json({mensagem:error.message})
  }
}

const logicaRobo = async (req,res) => {
  const {id,nome} = req.usuario;
  const {mensagem} = req.body;

    try {
      const usuarioMsg = await pool.query(`select * from mensagens where usuario_id = $1`,[id])
      if(usuarioMsg.rowCount == 0){
        await pool.query(`insert into mensagens(mensagens,usuario_id) values($1,$2)`,[mensagem,id])
       
        return res.status(200).json({mensagem:`Olá, ${nome} vamos começar? `})
      }
      if(usuarioMsg.rowCount == 1){
        await pool.query(`insert into mensagens(mensagens,usuario_id) values($1,$2)`,[mensagem,id])
        return res.status(200).json({mensagem:`Digite um número?`})
      }
      if(usuarioMsg.rowCount == 2){
        await pool.query(`insert into mensagens(mensagens,usuario_id) values($1,$2)`,[mensagem,id])
        return res.status(200).json({mensagem:`Digite outro número?`})
      }
      if(usuarioMsg.rowCount == 3){
        await pool.query(`delete from mensagens where usuario_id = $1`,[id])
        return res.status(200).json({mensagem:`O resultado da operação de soma é ${parseInt(usuarioMsg.rows[2].mensagens) +parseInt(mensagem)}.Obrigado por utilizar nosso Software, volte sempre.`})
      }
      return
    } 
    catch (error) {
      console.log(error.message)
      return res.status(400).json({mensagem:error.message})
    }
}

module.exports = {
cadastrarUsuario,
loginUsuario, 
logicaRobo,
cadastrarContato,
listarContato,
deletarContato
}

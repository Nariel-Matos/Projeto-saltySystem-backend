const pool = require("../controladores/api/conexao");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../segredo/segredo");

const validarSchema = (schema) => async (req,res,next) => {
try {
    await schema.validateAsync(req.body)
    next()
    
} catch (error) {
    return res.status(400).json({mensagem:error.message})
}

}

const autenticacao = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: "usuário não autorizado" })
    }

    const token = authorization.split(" ")[1]

    try {
        const { id } = jwt.verify(token, senhaJwt)

        const { rows, rowCount } = await pool.query("select * from usuarios where id = $1", [id]);

        if (rowCount === 0) {
            return res.status(401).json({ mensagem: "usuário não autorizado" })
        }

        req.usuario = rows[0]

        next()


    } catch (error) {
        return res.status(401).json({ mensagem: "usuário não autorizado" })
    }
  

}
module.exports = {
    validarSchema,
    autenticacao
}

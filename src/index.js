const express = require ('express');
const app = express();
const cors = require('cors');
const rota = require("../src/controladores/rotas/rotas")

const porta = 3000;

app.use(express.json());
app.use(cors());

app.use(rota)


 app.listen(porta);

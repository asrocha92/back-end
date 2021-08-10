require('dotenv').config();

const express = require('express');
const cors = require('cors');
const util = require('./util/utils');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());

/**
 * Todos as requisições devem passar primeiro por este método
 * Definir cabeçalhonp
 */
app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Expose-Headers", "X-PINGOTHER, Content-Type, Authorization");
  app.use(cors());

  req.dh_inicio = util.getDH();
  next();
});

//import endpoint
require('./endpoint/usuarioEndPoint').init(app, auth.authBearrer, sendRequest);

app.post('/teste', async (req, res) => {
  sendRequest(req, res, {success: true, teste:'teste'});
});

function sendRequest(req, res, dataResult) {
  try {
    if (!dataResult) {
      dataResult = { error: true };
    }
    dataResult.dh_inicio = req.dh_inicio;
    dataResult.dh_fim = util.getDH();
    dataResult.userID = req.userID;
    if (dataResult.success) {
      res.send(JSON.stringify(dataResult));
    } else {
      res.status(400).send(JSON.stringify(dataResult));
    }
  } catch (error) {
    res.status(400).send(JSON.stringify({ error: true, mensagem: "Houve um problema(COD001), entrar em contato com o suporte.", dh_inicio: req.dh_inicio, "dh_fim": getDH() }));
  }
}

app.get('/', async (req, res) => {
  res.send('request not authorized')
});

app.listen(process.env.HOST_PORT, process.env.HOST_ADDRESS, (res) => {
  console.log("Inicie servidor: http://" + process.env.HOST_ADDRESS + ":" + process.env.HOST_PORT);
});
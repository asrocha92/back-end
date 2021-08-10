const jwt = require('jsonwebtoken');
const { promisify } = require('util');
require('dotenv').config();

const auth = {
    tokenKey: 'ffc674a9314e1f2804a68c06d79ce868',
    authBearrer: async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).send(JSON.stringify({ error: true, "mensagem": "Requisição inválida.", direct: "login" }));
        }

        const [bearer, token] = authHeader.split(' ');
        if (!token) {
            return res.status(400).send(JSON.stringify({ error: true, "mensagem": "Requisição inválida.", direct: "login" }));
        }

        try {
            const decode = await promisify(jwt.verify)(token, process.env.AUTH_KEY_SECRET);
            req.userID = decode.id;
            //console.log('decode', decode);
            return next();
        } catch (error) {
            console.log(error);
            return res.status(400).send(JSON.stringify({ error: true, "mensagem": "Token inválido.", direct: "login" }));
        }
    },
    gerarToken: (dados) => {
        return jwt.sign(
            dados, 
            process.env.AUTH_KEY_SECRET,
            { expiresIn: "1h" });
    }
};

module.exports = auth;
//import constroler
const ctrls = require('../controller/UsuarioCtrl');

const endpointUsuario = {
    init: (app, auth, sendRequest) => {
        app.get('/usuario/consultar/:id', auth, async (req, res) => {
            const { id } = req.params;
            const result = await ctrls.usuarioCtrl.consultar(id);
            sendRequest(req, res, result);
        });

        app.get('/usuario/listar', auth, async (req, res) => {
            const result = await ctrls.usuarioCtrl.listar();
            sendRequest(req, res, result);
        });

        app.post('/usuario/cadastrar', auth, async (req, res) => {
            const result = await ctrls.usuarioCtrl.cadastrar(req.body);
            sendRequest(req, res, result);
        });

        app.put('/usuario/editar', auth, async (req, res) => {
            const result = await ctrls.usuarioCtrl.editar(req.body);
            sendRequest(req, res, result);
        });

        app.delete('/usuario/excluir', auth, async (req, res) => {
            const result = await ctrls.usuarioCtrl.excluir(req.body);
            sendRequest(req, res, result);
        });

        app.get('/login', async (req, res) => {
            const result = await ctrls.usuarioCtrl.login(req.body);
            sendRequest(req, res, result);
        });

        app.put('/usuario/alterar-senha', auth, async (req, res) => {
            const result = await ctrls.usuarioCtrl.alterarSenha(req.body);
            sendRequest(req, res, result);
        });
    }
}

module.exports = endpointUsuario;
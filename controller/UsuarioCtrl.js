const usuarioModel = require('../models/UsuarioModel');
const util = require('../util/utils');
const md5 = require('md5');
const auth = require('../middleware/auth');


const ctrl = {
    usuarioCtrl: {
        cadastrar: async (usuario) => {
            if (!usuario.login) {
                return { erro: true, mensagem: "Necessário informar login!" };
            }
            if (!usuario.senha) {
                return { erro: true, mensagem: "Necessário informar senha!" };
            }
            if (!usuario.email) {
                return { erro: true, mensagem: "Necessário informar email!" };
            }

            try {
                if (await ctrl.usuarioCtrl.existe(usuario.login)) {
                    return { erro: true, mensagem: "Login informado já existe." };
                }
            } catch (error) {
                return { erro: true, mensagem: "Ocorreu um problema COD(USU001)" };
            }

            usuario.senha = md5(usuario.senha)

            return await usuarioModel.create(usuario)
                .then((res) => {
                    //console.log(res, 'create success');
                    return { success: true, mensagem: "Cadastrado com sucesso" };
                }).catch((error) => {
                    console.log(error, 'create error');
                    return { erro: true, mensagem: "Houve um erro ao cadastrar" };
                });
        },
        editar: async (usuario) => {
            if (!usuario.id) {
                return { erro: true, mensagem: "Não é possivél editar sem referência. COD(USU002)" };
            }
            if (!usuario.email) {
                return { erro: true, mensagem: "Necessário informar email!" };
            }

            return await usuarioModel.update({
                        email: usuario.email,
                        tipo_usuario: usuario.tipo_usuario,
                        tipo_aplicacao: usuario.tipo_aplicacao,
                        ativo: usuario.ativo,
                    },
                {
                    where: {id: usuario.id}
                }).then((res) => {
                    return { success: true, mensagem: "Alterado com sucesso" };
                }).catch((error) => {
                    console.log(error, 'create error');
                    return { erro: true, mensagem: "Houve um erro ao alterado" };
                });

        },
        excluir: async (dados) => {
            if (!dados.id) {
                return { erro: true, mensagem: "Não é possivél excluir sem referência. COD(USU002)" };
            }
            try {
                let getLogin = await ctrl.usuarioCtrl.login(dados.login, dados.senha);
                if (getLogin.error) {
                    return { erro: true, mensagem: "Login inválido COD(USU-DEL001)" };
                }
                if (getLogin.tipo_usuario !== 'ADMIN') {
                    if (getLogin.usuario.id !== dados.id) {
                        return { erro: true, mensagem: "Não tem permisão para alterar COD(USU-DEL002)" };
                    }
                }
                let usuario =  await ctrl.usuario.login(dados);
                if (usuario.erro || (usuario.success && usuario.data === null) ) {
                    return { erro: true, mensagem: "Não existe registro COD(USU-DEL003)" };
                }
            } catch (error) {
                return { erro: true, mensagem: "Login inválido COD(USU-DEL004)" };
            }

            return await usuarioModel.update({
                    status: "2"
                },
                {
                    where: {id: dados.id}
                })
                .then((res) => {
                    return { success: true, mensagem: "Excluído com sucesso" };
                }).catch((error) => {
                    console.log(error, 'excluir error');
                    return { erro: true, mensagem: "Houve um erro ao excluir senha" };
                });
        },
        listar: async () => {
             return await usuarioModel.findAll({
                 attributes: ['id', 'login', 'senha', 'email', 'tipo_usuario', 'tipo_aplicacao', 'ativo'],
                 where: {
                     status: "1"
                 },
                 order: [['id', 'DESC']],
                 limit: 100
             }).then((res) => {
                 return { success: true, data: res};
             }).catch((error) => {
                 console.log(error, 'listar error');
                 return { erro: true, mensagem: "Houve um erro ao listar" };
             });
         },
        consultar: async (id) => {
            return await usuarioModel.findOne({
                attributes: ['id', 'login', 'email', 'tipo_usuario', 'tipo_aplicacao', 'ativo'],
                where: {
                    status: "1",
                    id: id
                }
            }).then((res) => {
                try {
                    return { success: true, data: util.converterObj(res) };
                } catch (error) {
                    return { success: true, data: null };
                }
            }).catch((error) => {
                console.log(error, 'create error');
                return { erro: true, mensagem: "Houve um erro no get Usuario" };
            });
        },
        existe: async (login) => {
            return await usuarioModel.findOne({
                where: {
                    status: "1",
                    login: login
                }
            }).then((res) => {
                try {
                    let usuario = util.converterObj(res);
                    if (usuario) {
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.log(error, 'existe error');
                    return true;//se houver erro retorna true
                }
            }).catch((error) => {
                console.log(error, 'existe error');
                return true;//se houver erro retorna true
            });
        },
        getUsuario: async (dados) => {
            try {
                if (!dados) {
                    return {  error: true, data: null };
                }
                let where = {status: "1"};
                if (!dados.id) {
                    where['id'] = id;
                }
                if (!dados.login) {
                    where['id'] = id;
                }
                return await usuarioModel.findOne({
                    where: where
                }).then((res) => {
                    try {
                        return { success: true, data: util.converterObj(res) };
                    } catch (error) {
                        return { success: true, data: null };
                    }
                }).catch((error) => {
                    return { error: true, data: null };
                });   
            } catch (error) {
                console.log(error);
                return {  error: true, data: null };
            }
        },
        login: async (dados) => {
            //console.log(await md5(senha));
            return await usuarioModel.findOne({
                attributes: ['id', 'login', "senha", 'email', 'tipo_usuario', 'tipo_aplicacao', 'ativo'],
                where: {
                    status: "1",
                    login: dados.login
                },
            }).then((res) => {
                try {
                    let usuario = util.converterObj(res);

                    //validar login
                    if (usuario === null) {
                        return {error: true, mensagem: "Login ou senha incorretos."};
                    }

                    //validar senha
                    if (usuario.senha != md5(dados.senha)) {
                        return {error: true, mensagem: "Login ou senha incorretos."};
                    }
                    
                    usuario.senha = null;
                    const token = auth.gerarToken(usuario);
                    return {
                        success: true,
                        mensagem: "Realizado login com sucesso.",
                        token: token
                    };
                } catch (error) {
                    console.log(error, 'login error');
                    return { erro: true, mensagem: "Houve um erro no login COD(LOG001)" };
                }
            }).catch((error) => {
                console.log(error, 'login error');
                return { erro: true, mensagem: "Houve um erro no login COD(LOG002)" };
            });
        },
        alterarSenha: async (dados) => {
            if (!dados.id) {
                return { erro: true, mensagem: "Não é possivél alterar." };
            }
            if (!dados.login) {
                return { erro: true, mensagem: "Não é possivél alterar." };
            }
            if (!dados.novasenha) {
                return { erro: true, mensagem: "Necessário informar nova senha!" };
            }

            if (dados.usuario_admin) {
                try {
                    let usuario = await ctrl.usuarioCtrl.getUsuario(dados.usuario_admin);
                    if (usuario.error) {
                        return { erro: true, mensagem: "Login inválido COD(ATE001)" };
                    }
                    if (usuario.tipo_usuario !== 'ADMIN') {
                        return { erro: true, mensagem: "Não tem permisão para alterar COD(ALT002)" };
                    }
                } catch (error) {
                    return { erro: true, mensagem: "Não tem permisão para alterar COD(ALT003)" };
                }
            }

            try {
                let usuario = await ctrl.usuarioCtrl.getUsuario(dados);
                console.log('usua',usuario);
                if (usuario.error) {
                    return { erro: true, mensagem: "Login inválido COD(ATE004)" };
                }
            } catch (error) {
                return { erro: true, mensagem: "Login inválido COD(USU-ALT005)" };
            }

            return await usuarioModel.update({
                    senha: md5(dados.novasenha)
                },
                {
                    where: {id: dados.id}
                })
                .then((res) => {
                    return { success: true, mensagem: "Alterado com sucesso" };
                }).catch((error) => {
                    console.log(error, 'create error');
                    return { erro: true, mensagem: "Houve um erro ao alterado senha" };
                });

        },
    }
};

module.exports = ctrl;
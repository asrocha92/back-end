const { Sequelize, DataTypes } = require('sequelize');
const db = require('./db');

const usuario = db.define(
    'tt_usuario',
    {
        login: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo_usuario: {
            type: DataTypes.ENUM('NORMAL', 'ADMIN'),
            defaultValue: 'NORMAL',
            allowNull: false
        },
        tipo_aplicacao: {
            type: DataTypes.ENUM('ADM', 'APP', 'SITE', 'OUTRO'),
            defaultValue: 'OUTRO',
            allowNull: false
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('1', '2', '3'),
            defaultValue: '1'
        }
    }
);
//flag criar tabela
//usuario.sync();
//flag alterar tabela
//usuario.sync({alter: true});

module.exports = usuario;
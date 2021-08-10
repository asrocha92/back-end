const { Sequelize } = require('sequelize');
require('dotenv').config();

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.BD, process.env.BD_U, process.env.BD_P, {
  host: process.env.BD_HOST,
  dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

/**
 * Utilizado somente para teste

sequelize.authenticate().then(() =>{
    console.log('Sucesso: Conexão com banco de dados, realizado com sucesso.');
}).catch(()=> {
    console.log('Erro: Conexão com banco de dados, não efetuado.');
});
*/

module.exports = sequelize;
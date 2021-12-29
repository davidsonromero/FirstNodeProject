const Sequelize = require('sequelize')
const connection = new Sequelize('perguntas_e_respostas', 'davi', '123456', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection
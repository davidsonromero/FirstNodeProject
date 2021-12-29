const Sequelize = require('sequelize')
const connection = require('./database')

const Resposta = connection.define('resposta', {
    conteudo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

Resposta.sync({force: false}).then(() => {})

module.exports = Resposta
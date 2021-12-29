const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const ModelPerguntas = require('./database/Perguntas')
const ModelRespostas = require('./database/Resposta')

//Banco de dados
connection.authenticate().then(() => {
    console.log('Conectado ao banco de dados')
}).catch(() => {
    console.log('Conexão com o banco de dados falhou!')
})

//ejs
app.set('view engine', 'ejs')
app.use(express.static('public'))

//body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//rotas
app.get('/', (req, res) => {
    ModelPerguntas.findAll(
        {
            raw: true,
            order: [
                ['updatedAt', 'DESC']
            ]
        }
    ).then(perguntas => {
        res.render('index', {
            perguntas: perguntas
        })
    })
})

app.get('/perguntar/:error?', (req, res) => {
    let error = req.params.error
    error === "error" ? error = true : error = false
    res.render('perguntar', {
        error: error
    })
})

app.get('/pergunta/:id/:error?', (req, res) => {
    var id = req.params.id
    ModelPerguntas.findOne({
        where: {
            id: id,
        },
        raw: true
    }).then(pergunta => {
        ModelRespostas.findAll({
            where: {
                perguntaId: id
            },
            raw: true,
            order: [
                ['updatedAt', 'DESC']
            ]
        }).then(respostas => {
            let error
            req.params.error === "error" ? error = true : error = false
            pergunta != undefined ? res.render('pergunta', { pergunta: pergunta, error: error, respostas: respostas }) : res.redirect('/')
        })
    })
})

app.post('/salvar-pergunta', (req, res) => {
    let titulo = req.body.titulo
    let pergunta = req.body.pergunta
    if(pergunta === "" || titulo === ""){
        res.redirect('/perguntar/error')
    } else {
        ModelPerguntas.create({
            titulo: titulo,
            pergunta: pergunta
        }).then(() => {
            console.log("Pergunta salva: " + titulo)
            res.redirect('/')
        }).catch((err) => {
            console.log(err)
            res.redirect('/perguntar/error')
        })
    }
})

app.post('/salvar-resposta/:id', (req, res) => {
    let resposta = req.body.resposta
    let id = req.params.id
    if(resposta === ""){
        res.redirect(`/pergunta/${id}/error`)
    } else {
        ModelRespostas.create({
            conteudo: resposta,
            perguntaId: id
        }).then(() => {
            console.log("Resposta salva para a pergunta " + id)
            res.redirect(`/pergunta/${id}/`)
        }).catch((err) => {
            console.log(err)
            res.redirect(`/pergunta/${id}/error`)
        })
    }
})

app.listen(80, () => {
    console.log('Server running on port 80')
})
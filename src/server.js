//Servidor
const express = require("express")
const server = express()

const { pageLanding,pageStudy,pageGiveClasses,saveClasses} = require("./pages")

//Configurar nunjucks *(template engine)
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
})

//Inicio da configuração do servidor
server

//receber os dados do req.body
.use(express.urlencoded({extended: true}))
//Config do servidor para usar os arquivos estaticos/statics(css,scripts,imagens) na pasta "public"
.use(express.static("public"))

//Rotas da aplicação
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.post("/save-classes",saveClasses)
//Start/Porta do servidor
.listen(5500)


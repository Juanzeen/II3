const fs = require('fs')
const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.route('/')
    .get((req, res) => {
        res.render('cadastro')
    })

    .post((req, res) => {
        res.render('sucesso')
        fs.writeFileSync(req.body.email + ".txt", JSON.stringify(req.body))
    })

const rotaCadastroSalvo = app.route('/cadastros');
rotaCadastroSalvo.get((req, res) => {
    let cadastrosSalvos = [];
    fs.readdirSync(".").forEach(file => {
        if (file.includes(".txt")) {
            cadastrosSalvos.push(file);
        }
    })
    console.log(cadastrosSalvos)
    res.render('cadastrossalvos', { cadastros: cadastrosSalvos })
})


 app.route('/editar')
    .get((req, res) =>{
    const nomeArquivo = req.query.nome
    const conteudoArquivo = fs.readFileSync(nomeArquivo)
    const stringArquivo = conteudoArquivo.toString()
    const objArquivo = JSON.parse(stringArquivo)
    res.render('editar', {cadastro:objArquivo})
})
    .post((req, res) =>{
        const nomeArquivo = req.query.nome
        fs.unlink(nomeArquivo,()=>{})
        fs.writeFileSync(req.body.email + ".txt", JSON.stringify(req.body))
        res.render('sucesso')
    })

   



app.route('/apagar')
    .get((req, res) => {
        const nomeArquivo = req.query.nome
        console.log(nomeArquivo);
        fs.unlink(nomeArquivo, () => { console.log('Arquivo apagado.') })
        res.redirect('cadastros')
    })                

app.listen(8080, () => console.log('Servidor trabalhando na porta 8080.'))
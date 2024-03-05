let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

let express = require('express')
let app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('cadastro')
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando na porta: ' + PORT));

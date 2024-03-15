

//constantes 

const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
//body parser
app.use(bodyParser.urlencoded({ extended: true }))

// servidor puerto 3000
app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
})

// Middleware para servir archivos estáticos desde la carpeta 'assets'
app.use(express.static('assets'))

// Middleware para leer y parsear el archivo de usuarios JSON en cada solicitud, en 
// caso de que el archivo cambie
app.use((req, res, next) => {
    try {
        const usuariosPath = path.join(__dirname, 'assets', 'usuarios.json')
        req.usuariosJSON = JSON.parse(fs.readFileSync(usuariosPath))
        next()
    } catch (error) {
        console.error('Error al leer el archivo de usuarios:', error)
        res.status(500).send('Error interno del servidor')
    }
})

// Ruta para obtener el archivo de usuarios JSON

app.get('/abracadabra/usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'usuarios.json'))
})

// Middleware para verificar si el usuario existe en el archivo json

app.use('/abracadabra/juego/:usuario', (req, res, next) => {
    const nombreUsuario = req.params.usuario
    const usuarios = req.usuariosJSON.usuarios
    if (usuarios.includes(nombreUsuario)) {
        next()
    } else {
        res.status(404).send(__dirname + '/assets/who.jpeg' ) //mostrar el Who jpeg
     }
})

// Ruta para index 

app.get('/abracadabra/juego/:usuario', (req, res) => {
    
    res.sendFile(path.join(__dirname, 'index.html'))
})


app.get('/abracadabra/conejo/:n', (req, res) => {
    const n = req.params.n
    let azar = Math.floor(Math.random() * (4 - 1)) + 1
    const imagen = (n == azar) ? 'conejito.jpg' : 'voldemort.jpg'
    res.sendFile(path.join(__dirname, 'assets', imagen))
})
//ruta para ingresar nombre
app.get('/abracadabra/ingresar', (req, res) => {
    res.sendFile(path.join(__dirname, 'ingresar.html'))
})
// ruta para obtener el nombre
app.post('/abracadabra/ingresar', (req, res) => {
    const nombreUsuario = req.body.usuario
    const usuarios = req.usuariosJSON.usuarios

    if (usuarios.includes(nombreUsuario)) {
        res.redirect(`/abracadabra/juego/${nombreUsuario}`)
    } else {
        // Agregar al usuario al JSON
        usuarios.push(nombreUsuario);

        // Guardar el archivo JSON actualizado

        const usuariosPath = path.join(__dirname, 'assets', 'usuarios.json')
        fs.writeFileSync(usuariosPath, JSON.stringify(req.usuariosJSON, null, 2))

        // Redirigir al usuario a la página correspondiente

        res.redirect(`/abracadabra/juego/${nombreUsuario}`)
    }
})
//ruta generica para cualquier otra ruta de error

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'error.html'))
})

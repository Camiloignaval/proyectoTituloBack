const express = require('express')
const cors = require('cors')
const dayjs = require('dayjs')
require('dotenv').config()
require('dayjs/locale/es')
dayjs.locale('es')

const app = express()
// cors
app.use(cors())

// lectura y parseo de body
app.use(express.json())

// directorio publico
app.use(express.static('public'))

// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/msg', require('./routes/msg'))
app.use('/api/user', require('./routes/user'))
app.use('/api/personal', require('./routes/personal'))

// escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`)
})

const { Router } = require('express')
const { enviarMensaje, intercambioMsg } = require('../controllers/msg')
const { validarJWT } = require('../middlewares/validarJWT')
const router = Router()

// base /api/msg/
router.post('/send', validarJWT, enviarMensaje)
router.post('/intercambioMsg', validarJWT, intercambioMsg)

module.exports = router

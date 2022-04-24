const { Router } = require('express')
const { getEntrenados } = require('../controllers/personal')
const { validarJWT } = require('../middlewares/validarJWT')
const router = Router()

// BASE /api/personal/

// Middleware para todas las rutas
router.use(validarJWT)

// router.post('/pagotransferencia', ingresarPago)
router.get('/entrenados:idPersonal', getEntrenados)

module.exports = router

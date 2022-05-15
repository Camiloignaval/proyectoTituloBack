const { Router } = require('express')
const { ingresarPago, traerPagos, obtenerAforoPorDia, insertReserve, getDayOff, getReserve, deleteReserve } = require('../controllers/user')
const { validarEstadoFinanciero } = require('../middlewares/validarEstadoFinanciero')
const { validarJWT } = require('../middlewares/validarJWT')
const router = Router()

// BASE /api/user/

// Middleware para todas las rutas
router.use(validarJWT)

router.post('/pagotransferencia', ingresarPago)
router.get('/pagos:id', validarEstadoFinanciero, traerPagos)
router.get('/aforo:fecha', obtenerAforoPorDia)
router.post('/reserve', insertReserve)
router.delete('/reserve', deleteReserve)
router.get('/reserve:id', getReserve)
router.get('/dayoff', getDayOff)

module.exports = router

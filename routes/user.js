const { Router } = require("express");
const { ingresarPago, traerPagos } = require("../controllers/user");
const { validarEstadoFinanciero } = require("../middlewares/validarEstadoFinanciero");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

// BASE /api/user/

// Middleware para todas las rutas
router.use(validarJWT);


router.post("/pagoefectivo", ingresarPago);
router.get("/pagos:id",validarEstadoFinanciero, traerPagos);




module.exports = router;

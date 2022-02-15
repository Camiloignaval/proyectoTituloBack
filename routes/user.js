const { Router } = require("express");
const { ingresarPago, traerPagos } = require("../controllers/user");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

// BASE /api/user/

// Middleware para todas las rutas
router.use(validarJWT);

router.post("/pagoefectivo", ingresarPago);
router.get("/pagos:id", traerPagos);




module.exports = router;

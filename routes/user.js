const { Router } = require("express");
const { ingresarPago } = require("../controllers/user");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

// BASE /api/user/

// Middleware para todas las rutas
router.use(validarJWT);

router.post("/pagoefectivo", ingresarPago);



module.exports = router;

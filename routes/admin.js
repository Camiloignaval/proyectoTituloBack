const { Router } = require("express");
const {
	traerSolicitudes,
	crearUsuario,
	eliminarSolicitud,
	traerUsuarios,
	intercambiarBloqueo,
	responseRequest,
	pagoPresencial,
	solicitudDePago,
	pagoValidado,
} = require("../controllers/admin");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

// BASE /api/admin/

// Middleware para todas las rutas
router.use(validarJWT);

router.get("/requests", traerSolicitudes);
router.put("/requests", responseRequest);

// router.post("/user", crearUsuario);
router.get("/user", traerUsuarios);
// router.put("/user/:id", traerUsuarios);

router.put("/block", intercambiarBloqueo);

// finanzas
router.put("/pagopresencial", pagoPresencial);

router.get("/payrequest", solicitudDePago);
router.put("/validatepay", pagoValidado);


module.exports = router;

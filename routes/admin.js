const { Router } = require("express");
const {
	traerSolicitudes,
	crearUsuario,
	eliminarSolicitud,
	traerUsuarios,
	intercambiarBloqueo,
} = require("../controllers/admin");
const router = Router();

// BASE /api/admin/
// obtener solicitudes
router.get("/requests", traerSolicitudes);
router.delete("/requests", eliminarSolicitud);

router.post("/user", crearUsuario);
router.get("/user", traerUsuarios);

router.put("/block", intercambiarBloqueo);

module.exports = router;

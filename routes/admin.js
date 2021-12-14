const { Router } = require("express");
const { traerSolicitudes, crearUsuario } = require("../controllers/admin");
const router = Router();

// BASE /api/admin/
// obtener solicitudes
router.get("/requests", traerSolicitudes);
router.post("/user", crearUsuario);

module.exports = router;

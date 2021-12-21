const { Router } = require("express");
const { enviarMensaje } = require("../controllers/msg");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

// base /api/msg/
router.post("/send", validarJWT, enviarMensaje);

module.exports = router;

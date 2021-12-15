const { Router } = require("express");
const { enviarMensaje } = require("../controllers/msg");
const router = Router();

// base /api/msg/
router.post("/send", enviarMensaje);

module.exports = router;

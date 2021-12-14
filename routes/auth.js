const { Router } = require("express");
const { envioSolicitud } = require("../controllers/auth");
const router = Router();

router.post("/register", envioSolicitud);

module.exports = router;

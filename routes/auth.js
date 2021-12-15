const { Router } = require("express");
const { envioSolicitud, login } = require("../controllers/auth");
const router = Router();

router.post("/register", envioSolicitud);
router.post("/", login);

module.exports = router;

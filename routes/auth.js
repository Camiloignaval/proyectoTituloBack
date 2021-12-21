const { Router } = require("express");
const {
	envioSolicitud,
	login,
	revalidarToken,
} = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

router.post("/register", envioSolicitud);
router.post("/", login);
router.get("/renew", validarJWT, revalidarToken);

module.exports = router;

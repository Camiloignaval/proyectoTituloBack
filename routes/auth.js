const { Router } = require("express");
const {
	envioSolicitud,
	login,
	revalidarToken,
	crearUsuario,
} = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

router.post("/user", crearUsuario);
router.post("/", login);
router.get("/renew", validarJWT, revalidarToken);

module.exports = router;

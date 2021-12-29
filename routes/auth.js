const { Router } = require("express");
const {
	login,
	revalidarToken,
	crearUsuario,
	modificarUsuario,
	darUsuarioDeBaja,
} = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

router.post("/user", crearUsuario);
router.put("/user", modificarUsuario);
router.delete("/user", darUsuarioDeBaja);
router.post("/", login);
router.get("/renew", validarJWT, revalidarToken);

module.exports = router;

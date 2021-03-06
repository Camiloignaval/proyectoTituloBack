const { Router } = require("express");
const {
  login,
  revalidarToken,
  crearUsuario,
  modificarUsuario,
  darUsuarioDeBaja,
  modificarContrase├▒a,
  modificarImgPerfil,
  getRoutines,
  deleteRequestRoutine,
  deleteRoutine,
} = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

// BASE /api/auth/

router.post("/user", crearUsuario);
router.put("/user", modificarUsuario);
router.delete("/user", darUsuarioDeBaja);
router.put("/pass", modificarContrase├▒a);
router.put("/imgPerfil", modificarImgPerfil);
router.post("/", login);
router.get("/routine", getRoutines);
router.put("/routine", deleteRequestRoutine);
router.delete("/routine", deleteRoutine);
router.get("/renew", validarJWT, revalidarToken);

module.exports = router;

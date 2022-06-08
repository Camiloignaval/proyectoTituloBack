const { Router } = require("express");
const {
  traerSolicitudes,
  traerUsuarios,
  intercambiarBloqueo,
  responseRequest,
  pagoPresencial,
  solicitudDePago,
  pagoValidado,
  envioEmailAtrasados,
  guardarHorarios,
  obtenerHorarios,
  guardarHorasBloqueadas,
  obtenerHorasBloqueadas,
  eliminarHorasBloqueadas,
  consultAssistance,
  getReservesHours,
  getRoutinesRequest,
  proccessRoutinesRequest,
  changelevel,
} = require("../controllers/admin");
const { validarJWT } = require("../middlewares/validarJWT");
const router = Router();

// BASE /api/admin/

// Middleware para todas las rutas
router.use(validarJWT);

router.get("/requests", traerSolicitudes);
router.put("/requests", responseRequest);

// router.post("/user", crearUsuario);
router.get("/user", traerUsuarios);
// router.put("/user/:id", traerUsuarios);

router.put("/block", intercambiarBloqueo);

// finanzas
router.put("/pagopresencial", pagoPresencial);

router.get("/payrequest", solicitudDePago);
router.put("/validatepay", pagoValidado);
router.get("/pagosatrasados", envioEmailAtrasados);

// HORARIOS
router.post("/schedules", guardarHorarios);
router.get("/schedules", obtenerHorarios);

// bloqueo horas
router.post("/hoursblock", guardarHorasBloqueadas);
router.get("/hoursblock", obtenerHorasBloqueadas);
router.delete("/hoursblock", eliminarHorasBloqueadas);

// CONSULTAR ASISTENCIA
router.post("/consultassistance", consultAssistance);

// reservas
router.get("/reserves:date", getReservesHours);

// Rutinas

router.get("/routines", getRoutinesRequest);
router.put("/routines", proccessRoutinesRequest);

// cambiarlvluser
router.put("/changelevel", changelevel);

module.exports = router;

const dayjs = require("dayjs");
const {
  getEntranadosPorId,
  insertRoutine,
  insertExercises,
} = require("../database/querys");

const getEntrenados = async (req, res) => {
  try {
    const response = await getEntranadosPorId(Object.values(req.params));
    res.status(200).send(response);
  } catch (error) {
    res.status(400).json({
      ok: false,
    });
  }
};

const sendRoutine = async (req, res) => {
  const fecha = dayjs().format("YYYY-MM-DD");
  const { id_entrenador, nivel, info, name } = req.body;
  try {
    const response = await insertRoutine([fecha, id_entrenador, nivel, name]);
    const { id_rutina } = response[0];
    info?.map(async (e) => {
      /* Calling the function insertExercises with an array as a parameter. */
      await insertExercises([id_rutina, ...Object.values(e)]);
    });
    res.status(200).json({
      ok: true,
      msg: "Rutina enviada",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
    });
  }
};

module.exports = {
  getEntrenados,
  sendRoutine,
};

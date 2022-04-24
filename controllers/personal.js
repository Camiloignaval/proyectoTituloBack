const { getEntranadosPorId } = require('../database/querys')

const getEntrenados = async (req, res) => {
  try {
    const response = await getEntranadosPorId(Object.values(req.params))
    res.status(200).send(
      response
    )
  } catch (error) {
    res.status(400).json({
      ok: false
    })
  }
}

module.exports = {
  getEntrenados
}

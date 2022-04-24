const { pagoEfectivo, selectPagos, selectEstadoFinanciero } = require('../database/querys')
const moment = require('moment')

const ingresarPago = async (req, res) => {
  console.log(req.body)
  const body = req.body
  const fechaActual = moment().format('DD/MM/YYYY HH:mm')
  body.fecha = fechaActual
  try {
    await pagoEfectivo(Object.values(body))
    res.status(200).json({
      msg: 'Pago registrado con éxito',
      ok: true
    })
  } catch (error) {
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}

const traerPagos = async (req, res) => {
  const { id } = req.params

  try {
    const pagos = await selectPagos([id])
    const estado = await selectEstadoFinanciero([id])
    res.status(200).json({
      ok: true,
      msg: 'Pagos cargados con exito',
      data: { pagos, estado }
    })
  } catch (error) {
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}

module.exports = {
  ingresarPago,
  traerPagos
}

/* eslint-disable camelcase */
const moment = require('moment')
const { montoTotalPagadoPorUser, mesesActivo, updateEstadoFinanciero } = require('../database/querys')

const updateEstadoFinancieroHelper = async (idUser) => {
  const { fecha_aceptado } = await mesesActivo([idUser])
  // calculando cuandos meses lleva activo
  const fechaAcept = moment(fecha_aceptado)
  const fechaHoy = moment()
  const diff = fechaHoy.diff(fechaAcept, 'month')
  const datosPago = await montoTotalPagadoPorUser([idUser])
  if (datosPago) {
    const { sum, valor_mensualidad } = await montoTotalPagadoPorUser([idUser])
    const deberiaLlevarPagado = valor_mensualidad * diff
    // console.log('deberia llevar', deberiaLlevarPagado, 'lleva', sum)

    // si lleva pagado mas de lo que deberia
    if (parseInt(sum) >= deberiaLlevarPagado) {
      await updateEstadoFinanciero([idUser, true])
    } else {
      await updateEstadoFinanciero([idUser, false])
    }
  } else {
    // console.log('no tiene pagos')
    await updateEstadoFinanciero([idUser, false])
  }
}

module.exports = {
  updateEstadoFinancieroHelper
}

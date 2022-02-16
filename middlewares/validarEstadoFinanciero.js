/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { buscarUsuarioPorRutdeClientes, mesesActivo, montoTotalPagadoPorUser, updateEstadoFinanciero } = require('../database/querys')

const validarEstadoFinanciero = async (req, res, next) => {
  const token = req.header('x-token')
  const { rut } = jwt.verify(token, process.env.SECRET_JWT_SEED)
  const datos = await buscarUsuarioPorRutdeClientes([rut])
  const { id_usuario, id_cargo } = datos[0]
  if (id_cargo == 3) {
    //  seleccionar fecha aceptado
    const { fecha_aceptado } = await mesesActivo([id_usuario])
    // calculando cuandos meses lleva activo
    const fechaAcept = moment(fecha_aceptado)
    const fechaHoy = moment()
    const diff = fechaHoy.diff(fechaAcept, 'month')
    const datosPago = await montoTotalPagadoPorUser([id_usuario])
    if (datosPago) {
      const { sum, valor_mensualidad } = datosPago
      // cuanto deberia llevar total segun meses entrenado
      const deberiaLlevarPagado = valor_mensualidad * diff
      // console.log('deberia llevar:',deberiaLlevarPagado, 'lleva:',sum)
      // si lleva pagado mas de lo que deberia
      if (parseInt(sum) >= deberiaLlevarPagado) {
        // ('lleva mas')
        await updateEstadoFinanciero([id_usuario, true])
      } else {
        // ('lleva menos')
        await updateEstadoFinanciero([id_usuario, false])
      }
    } else {
      console.log('no tiene pagos')
      await updateEstadoFinanciero([id_usuario, false])
    }
  } else {
    console.log('es admin no se hace nada')
  }

  next()
}

module.exports = {
  validarEstadoFinanciero
}

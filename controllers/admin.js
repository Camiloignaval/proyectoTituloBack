/* eslint-disable camelcase */
const {
  selectClientes,
  toggleBloqueoUsuario,
  aceptarSolicitud,
  rechazarSolicitud,
  buscarUsuarioPorRutdeClientes,
  ingresarPagoEfectivo,
  selectSolicitudPago,
  validarPago,
  selectClientesDeudores
} = require('../database/querys')
const moment = require('moment')
const { enviarMail } = require('../helpers/nodemailer')
const { updateEstadoFinancieroHelper } = require('../helpers/updateEstadoFinanciero')

const traerSolicitudes = async (req, res) => {
  try {
    const datos = await selectClientes(false)
    res.status(200).json({
      datos,
      msg: 'Solicitudes cargadas con exito',
      ok: true
    })
  } catch (error) {
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}
// respuesta a la solicitud
const responseRequest = async (req, res) => {
  const { id_usuario, accion, rut } = req.body
  const fechaActual = moment().format('DD/MM/YYYY HH:mm')
  try {
    const info = await buscarUsuarioPorRutdeClientes([rut])
    const { nombre, email } = info[0]
    if (accion === 'aceptar') {
      await aceptarSolicitud([id_usuario, fechaActual])
      // enviar email
      enviarMail('acept', email, 'Has sido aceptado!', { nombre })
      return res.status(200).json({
        msg: 'Usuario ha sido aceptado con éxito',
        ok: true
      })
    } else {
      await rechazarSolicitud([id_usuario, fechaActual])
      // enviar email rechazo
      enviarMail('reject', email, 'Tu solicitud no ha sido aprobada', {
        nombre
      })
      return res.status(200).json({
        msg: 'Usuario ha sido rechazado',
        ok: true
      })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      msg: 'Ha ocurrido un error!',
      ok: false
    })
  }
}

const traerUsuarios = async (req, res) => {
  try {
    const datos = await selectClientes(true)
    res.status(200).json({
      datos,
      msg: 'Clientes cargados con exito',
      ok: true
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      msg: 'Ha ocurrido un error',
      ok: false
    })
  }
}

const intercambiarBloqueo = async (req, res) => {
  const data = req.body
  //   const token = req.header('x-token')
  try {
    await toggleBloqueoUsuario(Object.values(data))
    if (data.bloquear) {
      return res.status(200).json({
        msg: 'Usuario ha sido bloqueado',
        ok: true
      })
    }
    res.status(200).json({
      msg: 'Usuario ha sido desbloqueado',
      ok: true
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      msg: 'Ha ocurrido un error',
      ok: false
    })
  }
}

const pagoPresencial = async (req, res) => {
  const body = req.body
  const fechaActual = moment().format('DD/MM/YYYY HH:mm')
  body[2] = fechaActual

  try {
    const existeRut = await buscarUsuarioPorRutdeClientes([body.rut])
    const { id_usuario } = existeRut[0]

    if (existeRut.length === 0) {
      res.status(400).json({
        ok: false,
        msg: 'Rut no esta registrado como cliente'
      })
    } else {
      await ingresarPagoEfectivo(Object.values(body))
      updateEstadoFinancieroHelper(id_usuario)
      return res.status(200).json({
        ok: true
      })
    }
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}

const solicitudDePago = async (req, res) => {
  try {
    const datos = await selectSolicitudPago()
    return res.status(200).json({
      ok: true,
      msg: 'datos cargados con exito',
      datos
    })
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}

const pagoValidado = async (req, res) => {
  const { idPago } = req.body
  try {
    const respuesta = await validarPago([idPago])
    const { id_usuario } = respuesta[0]
    updateEstadoFinancieroHelper(id_usuario)
    return res.status(200).json({
      ok: true,
      msg: 'Pago aprobado'
    })
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}

const envioEmailAtrasados = async (req, res) => {
  try {
    const clientesDeuda = await selectClientesDeudores()
    clientesDeuda.map(cl => enviarMail('atrasados', cl.email, 'Recordatorio de pago', { nombre: cl.nombre, apellido: cl.apellido }))
    res.status(200).json({
      ok: true,
      msg: 'Mensajes enviados con éxito'
    })
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}
module.exports = {
  envioEmailAtrasados,
  traerSolicitudes,
  traerUsuarios,
  intercambiarBloqueo,
  responseRequest,
  pagoPresencial,
  solicitudDePago,
  pagoValidado
}

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
  selectClientesDeudores,
  insertHorario,
  getHorarios,
  updateHorario,
  insertBLoqueoHoras,
  getBLoqueoHoras,
  deleteBLoqueoHoras,
  registerAssistance,
  getReservesHour,
  selectEmailInConflict,
  deleteHoursInConflict
} = require('../database/querys')
const moment = require('moment')
const { enviarMail } = require('../helpers/nodemailer')
const { updateEstadoFinancieroHelper } = require('../helpers/updateEstadoFinanciero')
const dayjs = require('dayjs')

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

const guardarHorarios = async (req, res) => {
  try {
    const response = await getHorarios()
    if (response.length === 0) {
      Object.values((req?.body)).map(async (d) => {
        const objetoProv = { ...d }
        if (objetoProv?.cerrado) {
          objetoProv.hora_inicio = '00:00'
          objetoProv.hora_final = '00:00'
          objetoProv.aforo = '0'
        }
        await insertHorario(Object.values(objetoProv))
      })
      return res.status(200).json({
        ok: true,
        msg: 'Horario guardado con éxito'
      })
    } else {
      Object.values((req?.body)).map(async (d) => {
        const objetoProv = { ...d }
        if (objetoProv?.cerrado) {
          objetoProv.hora_inicio = '00:00'
          objetoProv.hora_final = '00:00'
          objetoProv.aforo = '0'
        }
        console.log(objetoProv)
        await updateHorario(Object.values(objetoProv))
      })
      return res.status(200).json({
        ok: true,
        msg: 'Horario actualizado con éxito'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}

const obtenerHorarios = async (req, res) => {
  try {
    const response = await getHorarios()
    res.status(200).json({
      response,
      ok: true
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}

const guardarHorasBloqueadas = async (req, res) => {
  const body = req.body
  const { hora } = body
  try {
    // revisar si hay usuarios con horas tomadas en la hora bloqueada
    const emailsHorasEliminadas = await selectEmailInConflict([hora])
    await deleteHoursInConflict([hora])
    if (emailsHorasEliminadas.length > 0) {
      const emails = emailsHorasEliminadas.map(e => e.email)
      console.log(emails)
      await enviarMail('cancelHora', emails, 'Anulación de hora', { hora })
    }
    const response = await insertBLoqueoHoras(Object.values(body))
    res.status(200).json({
      response,
      ok: true,
      msg: 'Se han bloqueado las horas exitosamente'
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}

const obtenerHorasBloqueadas = async (req, res) => {
  try {
    const response = await getBLoqueoHoras()

    res.status(200).json({
      response,
      ok: true,
      msg: 'Se han bloqueado las horas exitosamente'
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}
const eliminarHorasBloqueadas = async (req, res) => {
  try {
    const response = await deleteBLoqueoHoras(Object.values(req.body))
    res.status(200).json({
      response,
      ok: true,
      msg: 'Bloqueo eliminado exitosamente'
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}

const consultAssistance = async (req, res) => {
  const { rut } = req.body
  const dia = dayjs().format('YYYY-MM-DD')
  const hora = dayjs().format('HH:00:00')
  try {
    const existe = await buscarUsuarioPorRutdeClientes([rut])
    if (existe.length > 0) {
      const response = await registerAssistance([rut, dia, hora])
      if (response.length > 0) {
        return res.status(200).json({
          ok: true,
          msg: 'Ingreso exitoso'
        })
      } else {
        return res.status(200).json({
          ok: false,
          msg: 'Usuario sin reserva'
        })
      }
    } else {
      return res.status(200).json({
        ok: false,
        msg: 'Rut no registra como cliente’'
      })
    }
  } catch (error) {

  }
}

const getReservesHours = async (req, res) => {
  try {
    const response = await getReservesHour(Object.values(req.params))
    console.log(response)
    if (response.length > 0) {
      return res.status(200).json({
        response,
        ok: true
      })
    } else {
      return res.status(200).json({
        ok: false,
        msg: 'No hay registros el dia seleccionado'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente denuevo'
    })
  }
}

module.exports = {
  getReservesHours,
  consultAssistance,
  eliminarHorasBloqueadas,
  obtenerHorasBloqueadas,
  guardarHorasBloqueadas,
  obtenerHorarios,
  guardarHorarios,
  envioEmailAtrasados,
  traerSolicitudes,
  traerUsuarios,
  intercambiarBloqueo,
  responseRequest,
  pagoPresencial,
  solicitudDePago,
  pagoValidado
}

/* eslint-disable camelcase */
const dayjs = require('dayjs')
const { traerMailById, datosUsuarioPorId, getEmailsClientes, getEmailsEntrenados, insertLogEmails } = require('../database/querys')
const { enviarMail } = require('../helpers/nodemailer')

const enviarMensaje = async (req, res) => {
  try {
    const { subject, mensaje, nombre, apellido, email: to, tipo } = req.body
    await enviarMail(tipo, to, subject, {
      nombre,
      apellido,
      mensaje
    })
    res.status(200).json({
      ok: true,
      msg: 'Mensaje enviado con exito'
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error, intente en otro momento'
    })
  }
}

const intercambioMsg = async (req, res) => {
  try {
    const {
      cargo,
      id_usuario,
      id_destinatario,
      subject,
      message,
      isMassive
    } = req.body
    if (!isMassive) {
      const datosRem = await datosUsuarioPorId([id_usuario])
      const mailDest = await traerMailById([id_destinatario])
      const { email, nombre, apellido } = mailDest[0]
      await enviarMail('intercambio', email, subject, { nombre, apellido, message, datosRem: datosRem[0] })
      // guardar log
      await insertLogEmails([dayjs().format(), id_usuario, id_destinatario, isMassive])
    } else {
      if (cargo === 1) {
        const emailsClientes = await getEmailsClientes()
        const arrayEmails = emailsClientes.map(e => e.email)
        const arrayIdsDestino = emailsClientes.map(e => e.id_usuario)

        await enviarMail('intercambioMasivoAdmin', arrayEmails, subject, { message })
        await insertLogEmails([dayjs().format(), id_usuario, arrayIdsDestino.join(',').replaceAll('"', ''), isMassive])
      } else if (cargo === 2) {
        const emailsEntrenados = await getEmailsEntrenados([id_usuario])
        const arrayEmails = emailsEntrenados.map(e => e.email)
        const arrayIdsDestino = emailsEntrenados.map(e => e.id_usuario)
        await enviarMail('intercambioMasivoPersonal', arrayEmails, subject, { message })
        await insertLogEmails([dayjs().format(), id_usuario, arrayIdsDestino.join(',').replaceAll('"', ''), isMassive])
      }
    }
    res.status(200).json({
      ok: true,
      msg: 'Mensaje enviado con exito'
    })
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Ha ocurrido un error'
    })
  }
}

module.exports = {
  enviarMensaje,
  intercambioMsg
}

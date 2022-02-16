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

module.exports = {
  enviarMensaje
}

const { enviarMail } = require("../helpers/nodemailer");

const enviarMensaje = async (req, res) => {
	const { subject, mensaje, nombre, apellido, email: to, tipo } = req.body;
	const resp = await enviarMail(tipo, to, subject, {
		nombre,
		apellido,
		mensaje,
	});
};

module.exports = {
	enviarMensaje,
};

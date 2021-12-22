const {
	borrarSolicitud,
	selectClientes,
	toggleBloqueoUsuario,
	aceptarSolicitud,
	rechazarSolicitud,
	buscarUsuarioPorRutdeClientes,
} = require("../database/querys");
const moment = require("moment");
const { enviarMail } = require("../helpers/nodemailer");

const traerSolicitudes = async (req, res) => {
	try {
		const datos = await selectClientes(false);
		res.status(200).json({
			datos,
			msg: "Solicitudes cargadas con exito",
			ok: true,
		});
	} catch (error) {
		res.status(400).json({
			message: "Ha ocurrido un error",
			ok: false,
		});
	}
};

const responseRequest = async (req, res) => {
	const { id_usuario, accion, rut } = req.body;
	const fechaActual = moment().format("DD/MM/YYYY HH:mm");
	try {
		// const { nombre, contraseña } = await buscarUsuarioPorRutdeClientes([rut]);
		console.log(user);
		if (accion === "aceptar") {
			await aceptarSolicitud([id_usuario]);
			// // enviar email
			// enviarMail("acept", email, "Has sido aceptado!", { nombre, contraseña });
			return res.status(200).json({
				msg: "Usuario ha sido aceptado con éxito",
				ok: true,
			});
		} else {
			await rechazarSolicitud([id_usuario, fechaActual]);
			return res.status(200).json({
				msg: "Usuario ha sido rechazado",
				ok: true,
			});
		}
	} catch (error) {
		res.status(400).json({
			msg: "Ha ocurrido un error!",
			ok: false,
		});
	}
};

const traerUsuarios = async (req, res) => {
	try {
		const datos = await selectClientes(true);
		res.status(200).json({
			datos,
			msg: "Clientes cargados con exito",
			ok: true,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			msg: "Ha ocurrido un error",
			ok: false,
		});
	}
};

const intercambiarBloqueo = async (req, res) => {
	const data = req.body;
	const token = req.header("x-token");

	try {
		await toggleBloqueoUsuario(Object.values(data));
		if (data.bloquear) {
			return res.status(200).json({
				msg: "Usuario ha sido bloqueado",
				ok: true,
			});
		}
		res.status(200).json({
			msg: "Usuario ha sido desbloqueado",
			ok: true,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			msg: "Ha ocurrido un error",
			ok: false,
		});
	}
};

module.exports = {
	traerSolicitudes,
	traerUsuarios,
	intercambiarBloqueo,
	responseRequest,
};

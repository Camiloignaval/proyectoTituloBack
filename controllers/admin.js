const {
	listaSolicitudes,
	existeDireccion,
	insertarUsuarioSinDireccion,
	insertarUsuarioConDireccion,
	borrarSolicitud,
	selectClientes,
	toggleBloqueoUsuario,
} = require("../database/querys");
const moment = require("moment");
const { enviarMail } = require("../helpers/nodemailer");
const bcrypt = require("bcrypt");

const traerSolicitudes = async (req, res) => {
	try {
		const datos = await listaSolicitudes();
		res.status(200).json({
			datos,
			msg: "Datos cargados con exito",
			ok: true,
		});
	} catch (error) {
		res.status(400).json({
			message: "Ha ocurrido un error",
			ok: false,
		});
	}
};

const crearUsuario = async (req, res) => {
	const {
		id_solicitud,
		nombre,
		apellido,
		fecha_nacimiento,
		contraseña,
		email,
		rut,
		comuna,
		calle,
	} = req.body;
	const datosCrear = {
		nombre,
		apellido,
		fecha: moment(fecha_nacimiento).format("DD-MM-YYYY"),
		contraseña,
		email,
		rut,
		calle,
		rango: 3,
		comuna,
	};

	// encriptando contraseña

	const hash = bcrypt.hashSync(contraseña, bcrypt.genSaltSync(10));
	datosCrear.contraseña = hash;

	console.log("la contraseña a guardar es:", datosCrear.contraseña);

	try {
		const buscacalle = await existeDireccion([calle, comuna]);
		if (buscacalle[0].count > 0) {
			console.log("Direccion ya existe");
			insertarUsuarioSinDireccion(Object.values(datosCrear), [id_solicitud]);
		} else {
			await insertarUsuarioConDireccion(
				[calle, comuna],
				Object.values(datosCrear),
				[id_solicitud],
			);
		}

		// enviar email
		enviarMail("acept", email, "Has sido aceptado!", { nombre, contraseña });

		res.status(200).json({
			msg: "Cliente ha sido aceptado",
			ok: true,
		});
	} catch (error) {
		res.status(400).json({
			msg: "Ha ocurrido un error, no se pudo realizar la acción",
			ok: false,
		});
	}
};

const eliminarSolicitud = async (req, res) => {
	try {
		const { id_solicitud } = req.body;
		await borrarSolicitud([id_solicitud]);
		res.status(200).json({
			msg: "Solicitud rechazada correctamente",
			ok: true,
		});
	} catch (error) {
		res.status(400).json({
			msg: "Ha ocurrido un error, no se pudo realizar la acción",
			ok: false,
		});
	}
};

const traerUsuarios = async (req, res) => {
	try {
		const datos = await selectClientes();
		if (datos.length === 0) {
			return res.status(200).json({
				msg: "No hay clientes en nuestra base de datos",
				ok: false,
			});
		}
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
	crearUsuario,
	eliminarSolicitud,
	traerUsuarios,
	intercambiarBloqueo,
};

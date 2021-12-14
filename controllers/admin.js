const {
	listaSolicitudes,
	insertarUsuario,
	insertarDireccion,
	existeDireccion,
	borrarSolicitud,
} = require("../database/querys");
const moment = require("moment");
const { enviarMail } = require("../helpers/nodemailer");

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

	try {
		const buscacalle = await existeDireccion([calle, comuna]);
		if (buscacalle[0].count > 0) {
			console.log("Direccion ya existe");
			await insertarUsuario(Object.values(datosCrear));
		} else {
			await insertarDireccion([calle, comuna]);
			await insertarUsuario(Object.values(datosCrear));
		}
		await borrarSolicitud([id_solicitud]);
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

module.exports = {
	traerSolicitudes,
	crearUsuario,
};

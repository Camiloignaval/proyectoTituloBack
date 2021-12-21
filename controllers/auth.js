const {
	enviarSolicitud,
	buscarUsuarioPorRutdeClientes,
	buscarUsuarioPorenSolicitudes,
} = require("../database/querys");
const moment = require("moment");
const bcrypt = require("bcrypt");
const { generarJWT } = require("../helpers/jwt");

const envioSolicitud = async (req, res) => {
	console.log(req.body);
	const {
		name,
		lastName,
		date,
		adress,
		comuna,
		region,
		rut,
		email,
		pass1,
		telefono,
	} = req.body;
	try {
		const cliente = await buscarUsuarioPorRutdeClientes([rut]);
		const solicitud = await buscarUsuarioPorenSolicitudes([rut]);

		if (cliente.length === 1) {
			return res.status(400).json({
				msg: "Rut ya se encuentra registrado",
				ok: false,
			});
		} else if (solicitud.length === 1) {
			res.status(400).json({
				msg: "Rut ya cuenta con una solicitud por aprobar",
				ok: false,
			});
		} else {
			const datos = await enviarSolicitud(
				Object.values({
					name,
					lastName,
					fecha: moment(date).format("DD-MM-YYYY"),
					adress,
					comuna,
					region,
					rut,
					email,
					pass1,
					telefono,
				}),
			);
			res.status(200).json({
				msg: "Se ha enviado tu solicitud con éxito!",
				ok: true,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: "Ha ocurrido un error",
			ok: false,
		});
	}
};

const login = async (req, res) => {
	const { rut: rutReq, password } = req.body;
	try {
		const resp = await buscarUsuarioPorRutdeClientes([rutReq]);
		const {
			contraseña: contraseñaBBDD,
			id_usuario,
			nombre,
			apellido,
			fecha_nacimiento,
			email,
			rut,
			id_cargo,
		} = resp[0];
		const comprobacion = bcrypt.compareSync(password, contraseñaBBDD);
		if (comprobacion) {
			const token = await generarJWT(id_usuario, id_cargo, rut);
			res.status(200).json({
				ok: true,
				token,
				data: {
					id_usuario,
					nombre,
					apellido,
					fecha_nacimiento,
					email,
					rut,
					id_cargo,
				},
			});
		} else {
			res.status(400).json({
				ok: false,
				msg: "Credenciales incorrectas",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({
			ok: false,
			msg: "Ha ocurrido un error, porfavor contactar con administración",
		});
	}
};

const revalidarToken = async (req, res = response) => {
	const { uid, cid, rut: rutConsulta } = req;
	// generar nuevo jwt
	const token = await generarJWT(uid, cid, rutConsulta);
	const data = await buscarUsuarioPorRutdeClientes([rutConsulta]);
	const {
		id_usuario,
		nombre,
		apellido,
		fecha_nacimiento,
		email,
		rut,
		id_cargo,
	} = data[0];
	res.json({
		ok: true,
		token,
		data: {
			id_usuario,
			nombre,
			apellido,
			fecha_nacimiento,
			email,
			rut,
			id_cargo,
		},
	});
};

module.exports = {
	envioSolicitud,
	login,
	revalidarToken,
};

const {
	buscarUsuarioPorRutdeClientes,
	insertarUsuario,
} = require("../database/querys");
const bcrypt = require("bcrypt");
const { generarJWT } = require("../helpers/jwt");
// const { parse } = require("dotenv");

const crearUsuario = async (req, res) => {
	const {
		type,
		name,
		lastName,
		date,
		rut,
		email,
		pass1: pass,
		adress,
		numero,
		piso,
		depto,
		comuna,
		telefono,
	} = req.body;
	const datosCrear = {
		type,
		name,
		lastName,
		date,
		rut,
		email,
		pass,
		adress,
		numero: parseInt(numero),
		piso: parseInt(piso) ? parseInt(piso) : null,
		depto: parseInt(depto) ? parseInt(depto) : null,
		comuna,
		telefono,
	};
	// encriptando contraseña

	const hash = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
	datosCrear.pass = hash;
	try {
		const cliente = await buscarUsuarioPorRutdeClientes([rut]);
		if (cliente.length === 1) {
			return res.status(400).json({
				msg: "Rut ya se encuentra registrado",
				ok: false,
			});
		} else {
			await insertarUsuario(Object.values(datosCrear));

			res.status(200).json({
				msg: `Estimad@ ${name}, nos pondremos en contacto con usted cuando su solicitud sea procesada`,
				ok: true,
			});
		}
	} catch (error) {
		res.status(400).json({
			msg: "Ha ocurrido un error, no se pudo realizar la acción",
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
	crearUsuario,
	login,
	revalidarToken,
};

const {
	buscarUsuarioPorRutdeClientes,
	insertarUsuario,
	actualizarUsuario,
	cambiarFechaBaja,
	cambiarContraseña,
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
			foto,
			telefono,
			solicitud_revisada,
			fecha_baja_usuario,
			bloqueado,
			fecha_rechazo_usuario,
		} = resp[0];
		console.log(fecha_rechazo_usuario);
		const comprobacion = bcrypt.compareSync(password, contraseñaBBDD);
		// Si solicitud aun no ha sido aprobada
		if (!solicitud_revisada) {
			return res.status(400).json({
				ok: false,
				msg: "Tu solicitud aun no ha sido aprobada",
			});
			// Si cliente fue rechazado
		} else if (solicitud_revisada && fecha_rechazo_usuario !== null) {
			return res.status(400).json({
				ok: false,
				msg: "Tu solicitud ha sido rechazada, contacta a un adminsitrador",
			});
			// Si usuario se dio de baja, o fue bloqueado
		} else if (fecha_baja_usuario !== null || bloqueado) {
			return res.status(400).json({
				ok: false,
				msg: "Tu cuenta no esta activa, porfavor contacta a un administrados",
			});
		}
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
					foto,
					telefono,
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
		foto,
		telefono,
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
			foto,
			telefono,
		},
	});
};

const modificarUsuario = async (req, res) => {
	const body = req.body;
	try {
		const resp = await actualizarUsuario(Object.values(body));
		res.status(200).json({
			ok: true,
			msg: "Datos actualizados con éxito",
		});
	} catch (error) {
		res.status(400).json({
			ok: false,
			msg: "Ha ocurrido un error, intente más tarde",
		});
	}
};

const darUsuarioDeBaja = async (req, res) => {
	const { id_usuario } = req.body;
	try {
		await cambiarFechaBaja(Object.values([id_usuario]));
		res.status(200).json({
			ok: true,
			msg: "Tu perfil ha sido dado de baja",
		});
	} catch (error) {
		console.log(error.message);
		res.status(400).json({
			ok: false,
			msg: "Ha ocurrido un error, intente más tarde",
		});
	}
};

const modificarContraseña = async (req, res) => {
	const { passActual, passNuevo, rut } = req.body;
	try {
		// hasheando nueva contraseña
		const hash = bcrypt.hashSync(passNuevo, bcrypt.genSaltSync(10));
		// comprobando contraseña actual
		const resp = await buscarUsuarioPorRutdeClientes([rut]);
		const { contraseña } = resp[0];
		const comprobacion = bcrypt.compareSync(passActual, contraseña);
		if (!comprobacion) {
			return res.status(400).json({
				ok: false,
				msg: "Contraseña actual es incorrecta",
			});
		} else {
			await cambiarContraseña([rut, hash]);
			return res.status(200).json({
				ok: true,
				msg: "Contraseña cambiada con éxito",
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			ok: false,
			msg: "Ha ocurrido un problema, intente en un momento",
		});
	}
};

module.exports = {
	darUsuarioDeBaja,
	modificarUsuario,
	crearUsuario,
	login,
	revalidarToken,
	modificarContraseña,
};

const { Pool } = require("pg");

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	password: "Kagrmarukelep92",
	database: "gimnasio",
	port: 5432,
});

const buscarUsuarioPorRutdeClientes = async (rut) => {
	const query = `SELECT * FROM usuarios u where u.rut=$1;
	`;
	try {
		const res = await pool.query(query, rut);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};
// const buscarUsuarioPorenSolicitudes = async (rut) => {
// 	const query = `SELECT s.nombre FROM solicitudes s where s.rut=$1;
// 	`;
// 	try {
// 		const res = await pool.query(query, rut);
// 		return res.rows;
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const borrarSolicitud = async (id) => {
// 	const query = `delete from solicitudes
// 	WHERE id_solicitud=$1;
// 	`;
// 	try {
// 		const res = await pool.query(query, id);
// 		return res.rows;
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const insertarUsuario = async (datos) => {
	try {
		console.log(datos);
		const queryUser = `INSERT INTO public.usuarios
		(nombre, apellido, fecha_nacimiento, contraseña, email, rut, id_cargo, bloqueado, telefono, calle, num_direccion, piso, depto, id_comuna, solicitud_revisada)
		VALUES($2,$3, $4, $7, $6, $5, $1, false, $13, $8, $9, $10, $11, (select c.id_comuna from comunas c where c.nombre_comuna=$12), false);
		`;
		const res = await pool.query(queryUser, datos);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const selectClientes = async (estadoSolicitud) => {
	const query = estadoSolicitud
		? `select * from usuarios u inner join
	comunas c on
	c.id_comuna=u.id_comuna
	where u.id_cargo=3 and u.fecha_rechazo_usuario is null`
		: `select * from usuarios u inner join
	comunas c on
	c.id_comuna=u.id_comuna where u.id_cargo !=1 and
	u.solicitud_revisada=${estadoSolicitud}`;

	try {
		const res = await pool.query(query);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const toggleBloqueoUsuario = async (datos) => {
	const query = `update usuarios
  SET bloqueado=$2
  WHERE id_usuario=$1;`;
	try {
		const res = await pool.query(query, datos);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const aceptarSolicitud = async (data) => {
	const query = `update usuarios
	  SET solicitud_revisada=true
	  WHERE id_usuario=$1;
	  `;
	try {
		const res = await pool.query(query, data);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const rechazarSolicitud = async (data) => {
	const query = `update usuarios
	  SET solicitud_revisada=true, fecha_rechazo_usuario=$2
	  WHERE id_usuario=$1;
	  `;
	try {
		const res = await pool.query(query, data);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};
module.exports = {
	buscarUsuarioPorRutdeClientes,
	insertarUsuario,
	selectClientes,
	toggleBloqueoUsuario,
	aceptarSolicitud,
	rechazarSolicitud,
};

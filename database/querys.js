const { Pool } = require("pg");

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	password: "Kagrmarukelep92",
	database: "gimnasio",
	port: 5432,
});
const listaSolicitudes = async () => {
	try {
		const query = "select * from solicitudes";
		const res = await pool.query(query);
		pool.end;
		return res.rows;
	} catch (err) {
		console.log(err);
	}
};

const enviarSolicitud = async (datos) => {
	try {
		const query = `insert into solicitudes
		(nombre, apellido, fecha_nacimiento, calle, comuna, region, rut, email, contraseña)
		VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);
		`;
		const res = await pool.query(query, datos);
		pool.end;
		return res.rows;
	} catch (err) {
		console.log(err);
	}
};

const insertarUsuario = async (data) => {
	const query = `insert into usuarios
	(nombre, apellido, fecha_nacimiento, contraseña, email, rut, id_direccion, id_cargo)
	VALUES($1, $2, $3, $4, $5, $6, (select d.id_direccion from direcciones d 
		where d.calle=$7 
		and d.id_comuna=(select c.id_comuna from comunas c where c.nombre=$9)), $8) returning *;
	`;
	try {
		const res = await pool.query(query, data);
		pool.end;
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const insertarDireccion = async (data) => {
	const query = `insert into direcciones
	(calle, id_comuna)
	VALUES($1, (select c.id_comuna from comunas c where c.nombre = $2)) returning *;
	`;
	try {
		const res = await pool.query(query, data);
		pool.end;
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const buscarUsuarioPorRutdeClientes = async (rut) => {
	const query = `SELECT u.nombre FROM usuarios u where u.rut=$1;
	`;
	try {
		const res = await pool.query(query, rut);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};
const buscarUsuarioPorenSolicitudes = async (rut) => {
	const query = `SELECT s.nombre FROM solicitudes s where s.rut=$1;
	`;
	try {
		const res = await pool.query(query, rut);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const existeDireccion = async (datos) => {
	const query = `select count(d.id_direccion) from direcciones d where d.calle=$1 
	and d.id_comuna=(select c.id_comuna from comunas c where c.nombre=$2)`;

	try {
		const res = await pool.query(query, datos);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const borrarSolicitud = async (id) => {
	const query = `delete from solicitudes
	WHERE id_solicitud=$1;
	`;
	try {
		const res = await pool.query(query, id);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};
module.exports = {
	listaSolicitudes,
	enviarSolicitud,
	insertarUsuario,
	insertarDireccion,
	buscarUsuarioPorRutdeClientes,
	buscarUsuarioPorenSolicitudes,
	existeDireccion,
	borrarSolicitud,
};

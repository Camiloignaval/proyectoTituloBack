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
	and d.id_comuna=(select c.id_comuna from comunas c where c.nombre_comuna=$2)`;

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

const insertarUsuarioSinDireccion = async (datos, id) => {
	try {
		await pool.query("BEGIN");
		const queryInsert = `insert into usuarios
	(nombre, apellido, fecha_nacimiento, contraseña, email, rut, id_direccion, id_cargo,bloqueado)
	VALUES($1, $2, $3, $4, $5, $6, (select d.id_direccion from direcciones d 
		where d.calle=$7 
		and d.id_comuna=(select c.id_comuna from comunas c where c.nombre_comuna=$9)), $8,false) returning *;
	`;
		const res = await pool.query(queryInsert, datos);
		const del = `delete from solicitudes
	WHERE id_solicitud=$1;
	`;
		await pool.query(del, id);
		await pool.query("COMMIT");
	} catch (error) {
		await pool.query("ROLLBACK");
		console.log(error);
	}
};

const insertarUsuarioConDireccion = async (direccion, datos, id) => {
	try {
		await pool.query("BEGIN");
		const dir = `insert into direcciones
		(calle, id_comuna)
		VALUES($1, (select c.id_comuna from comunas c where c.nombre_comuna = $2)) returning *;
		`;
		await pool.query(dir, direccion);
		const queryInsert = `insert into usuarios
	(nombre, apellido, fecha_nacimiento, contraseña, email, rut, id_direccion, id_cargo,bloqueado)
	VALUES($1, $2, $3, $4, $5, $6, (select d.id_direccion from direcciones d 
		where d.calle=$7 
		and d.id_comuna=(select c.id_comuna from comunas c where c.nombre_comuna=$9)), $8,false) returning *;
	`;
		const res = await pool.query(queryInsert, datos);
		const del = `delete from solicitudes
	WHERE id_solicitud=$1;
	`;
		await pool.query(del, id);
		await pool.query("COMMIT");
	} catch (error) {
		await pool.query("ROLLBACK");
		console.log(error);
	}
};

const selectClientes = async () => {
	const query = `select * from usuarios u inner join
	direcciones d on
	d.id_direccion=u.id_direccion
	inner join comunas c
	on d.id_comuna=c.id_comuna
	 where id_cargo=3`;
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
module.exports = {
	listaSolicitudes,
	enviarSolicitud,
	buscarUsuarioPorRutdeClientes,
	buscarUsuarioPorenSolicitudes,
	existeDireccion,
	borrarSolicitud,
	insertarUsuarioSinDireccion,
	insertarUsuarioConDireccion,
	selectClientes,
	toggleBloqueoUsuario,
};

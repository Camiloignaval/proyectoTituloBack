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

const insertarUsuario = async (datos) => {
	try {
		console.log(datos);
		const queryUser = `INSERT INTO public.usuarios
		(nombre, apellido, fecha_nacimiento, contraseña, email, rut, id_cargo, bloqueado, telefono, calle, num_direccion, piso, depto, id_comuna, solicitud_revisada, foto)
		VALUES($2,$3, $4, $7, $6, $5, $1, false, $13, $8, $9, $10, $11, (select c.id_comuna from comunas c where c.nombre_comuna=$12), false, 'https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg');
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
	where u.id_cargo=3 and u.fecha_rechazo_usuario is null and u.solicitud_revisada=true`
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

const actualizarUsuario = async (data) => {
	const query = `update usuarios
  SET telefono=$1,email=$2
  WHERE id_usuario=$3;
  `;
	try {
		const res = await pool.query(query, data);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const cambiarFechaBaja = async (datos) => {
	const query = `update usuarios
  SET  fecha_baja_usuario=(select now())
  WHERE id_usuario=$1;
  `;
	try {
		const res = await pool.query(query, datos);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const cambiarContraseña = async (datos) => {
	const query = `update usuarios
  SET contraseña=$2
  WHERE rut=$1;
  `;
	try {
		const res = await pool.query(query, datos);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const changeImg = async (data) => {
	const query = `update usuarios
	SET foto=$1
	WHERE id_usuario=$2;
	`;
	try {
		const res = await pool.query(query, data);
		return res.rows;
	} catch (error) {
		console.log(error);
	}
};

const ingresarPagoEfectivo=async (data) => {
	console.log(data);
const query= `INSERT INTO pago
(fecha_pago, monto, pago_aprobado, medio_pago, id_usuario)
VALUES($1, $3, true, 'efectivo', (select id_usuario from usuarios where rut=$2));
`
try {
	const res= await pool.query(query,data)
	return res.rows
} catch (error) {
	console.log(error);
}
}

const pagoEfectivo=async(array) => {
const query= `INSERT INTO pago
(fecha_pago, monto, banco_origen, num_cuenta_origen, num_operacion, pago_aprobado, medio_pago, id_usuario)
VALUES($6, $1, $4, $3, $2, false, 'transferencia', $5);
`
  try {
	  const res=await pool.query(query,array)
	  return res.rows
  } catch (error) {
	  console.log(error);
  }
}
module.exports = {
	actualizarUsuario,
	buscarUsuarioPorRutdeClientes,
	insertarUsuario,
	selectClientes,
	toggleBloqueoUsuario,
	aceptarSolicitud,
	rechazarSolicitud,
	cambiarFechaBaja,
	cambiarContraseña,
	changeImg,
	ingresarPagoEfectivo,
	pagoEfectivo
};

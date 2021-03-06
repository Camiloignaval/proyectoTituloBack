/* eslint-disable no-tabs */
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
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
		(nombre, apellido, fecha_nacimiento, contraseña, email, rut, id_cargo, bloqueado, telefono, calle, num_direccion, piso, depto, id_comuna, solicitud_revisada, foto,nivel_usuario)
		VALUES($2,$3, $4, $7, $6, $5, $1, false, $13, $8, $9, $10, $11, (select c.id_comuna from comunas c where c.nombre_comuna=$12), false, 'https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg',1);
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
	  SET solicitud_revisada=true, fecha_aceptado = $2
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
  const query =
    "update usuarios SET  fecha_baja_usuario=(select now())WHERE id_usuario=$1;";
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

const ingresarPagoEfectivo = async (data) => {
  console.log(data);
  const query = `INSERT INTO pago
(fecha_pago, monto, pago_aprobado, medio_pago, id_usuario)
VALUES($1, $3, true, 'efectivo', (select id_usuario from usuarios where rut=$2));
`;
  try {
    const res = await pool.query(query, data);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const pagoEfectivo = async (array) => {
  const query = `INSERT INTO pago
(fecha_pago, monto, banco_origen, num_cuenta_origen, num_operacion, pago_aprobado, medio_pago, id_usuario)
VALUES($6, $1, $4, $3, $2, false, 'transferencia', $5);
`;
  try {
    const res = await pool.query(query, array);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const selectSolicitudPago = async () => {
  const query =
    "SELECT id_pago, fecha_pago, monto, banco_origen, num_cuenta_origen, num_operacion, pago_aprobado, medio_pago, id_usuario from pago where pago_aprobado = false;";
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const validarPago = async (idPago) => {
  const query = `UPDATE pago
	SET pago_aprobado=true
	WHERE id_pago=$1 returning *;
	`;
  try {
    const res = await pool.query(query, idPago);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const mesesActivo = async (id) => {
  const query = "select fecha_aceptado from usuarios where id_usuario = $1";
  try {
    const res = await pool.query(query, id);
    return res.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const updateEstadoFinanciero = async (datos) => {
  const query = `UPDATE usuarios
	SET estado_financiero = $2
	WHERE id_usuario=$1;
	`;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const montoTotalPagadoPorUser = async (idUser) => {
  const query = `select sum(p.monto),p2.valor_mensualidad,u.id_usuario  from pago p
	inner join usuarios u 
	on u.id_usuario  = p.id_usuario 
	inner join planes p2 
	on p2.id_plan = u.id_plan 
	where p.pago_aprobado = true and u.id_usuario = $1
	group by (u.id_usuario,p2.valor_mensualidad)`;
  try {
    const res = await pool.query(query, idUser);
    return res.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const selectPagos = async (id) => {
  const query = `select p.fecha_pago ,p.monto,p.medio_pago, p.id_pago, p.pago_aprobado from pago p
  where p.id_usuario=$1 order by p.fecha_pago desc`;
  try {
    const res = await pool.query(query, id);
    return res.rows;
  } catch (error) {}
};

const selectEstadoFinanciero = async (id) => {
  const query = "select estado_financiero from usuarios where id_usuario = $1";
  try {
    const res = await pool.query(query, id);
    return res.rows;
  } catch (error) {}
};

const selectClientesDeudores = async () => {
  const query =
    "select email,nombre, apellido from usuarios where estado_financiero = false and bloqueado = false and fecha_baja_usuario is null";
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const traerTodosLosIdsClientes = async () => {
  const query =
    "select id_usuario from usuarios where bloqueado = false and fecha_baja_usuario is null and fecha_aceptado is not null";
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const getEntranadosPorId = async (id) => {
  const query =
    "select id_usuario,nombre,apellido from usuarios where entrenador=$1";
  try {
    const res = await pool.query(query, id);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const traerMailById = async (id) => {
  const query =
    "select email,nombre,apellido from usuarios where id_usuario=$1";
  try {
    const res = await pool.query(query, id);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const datosUsuarioPorId = async (id) => {
  const query = "select * from usuarios where id_usuario=$1";
  try {
    const res = await pool.query(query, id);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const getEmailsClientes = async () => {
  const query = "select email,id_usuario from usuarios where id_cargo=3";
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const getEmailsEntrenados = async (id) => {
  const query = "select email,id_usuario from usuarios where entrenador=$1";
  try {
    const res = await pool.query(query, id);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const insertLogEmails = async (datos) => {
  const query = `INSERT INTO public.registros_msj
  (fecha, usuario_remitente, usuario_destino, masivo)
  VALUES($1, $2, $3, $4);
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
};

const insertHorario = async (datos) => {
  const query = `INSERT INTO public.horario
  (dia_semana, hora_apertura, hora_cierre, aforo,cerrado)
  VALUES($1, $2, $3, $4,$5);
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
  }
};
const getHorarios = async (datos) => {
  const query = `select * from public.horario;
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
  }
};

const updateHorario = async (datos) => {
  const query = `UPDATE public.horario
  SET  hora_apertura=$2, hora_cierre=$3, aforo=$4, cerrado=$5 where dia_semana=$1;
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
  }
};

const insertBLoqueoHoras = async (data) => {
  const query = `INSERT INTO public.bloqueo_hora
  (hora, motivo)
  VALUES($1, $2) returning *;
  `;
  try {
    const res = await pool.query(query, data);
    return res.rows;
  } catch (error) {
    console.log(error.message);
  }
};
const getBLoqueoHoras = async (data) => {
  const query = `select * from public.bloqueo_hora;
  `;
  try {
    const res = await pool.query(query, data);
    return res.rows;
  } catch (error) {
    console.log(error.message);
  }
};
const deleteBLoqueoHoras = async (data) => {
  const query = `delete from public.bloqueo_hora where id_bloqueo_hora=$1;
  `;
  try {
    const res = await pool.query(query, data);
    return res.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const insertReserva = async (data) => {
  const query = `INSERT INTO public.reservas
  (id_usuario, fecha, asiste, hora)
  VALUES($1, $2, false, $3) returning *;
  `;
  try {
    const res = await pool.query(query, data);
    return res.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchReservedHoursByDay = async (day) => {
  const query =
    "select count(hora),hora from reservas r  where fecha = $1 group by hora ";
  try {
    const res = await pool.query(query, day);
    return res.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const selectAforoByDay = async (day) => {
  const query =
    "select aforo,hora_apertura,hora_cierre from horario where dia_semana = $1";
  try {
    const res = await pool.query(query, day);
    return res.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};
const getDaysOff = async () => {
  const query =
    "select dia_semana,hora_apertura,hora_cierre,cerrado from horario";
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};
const selectReserve = async (datos) => {
  const query =
    "select * from reservas where id_usuario =$1 and fecha >= $2 and asiste=false";
  try {
    const res = await pool.query(query, datos);
    return res.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};
const deletReserve = async (datos) => {
  const query = `DELETE FROM public.reservas
  WHERE id_reserva=$1;
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const registerAssistance = async (datos) => {
  const query = `UPDATE public.reservas
  SET asiste=true
  WHERE id_usuario=(select id_usuario from usuarios u where u.rut =$1 ) and fecha=$2 and hora = $3 and asiste =false returning *;`;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getReservesHour = async (fecha) => {
  const query = `SELECT nombre,apellido,  asiste, hora, fecha
  FROM public.reservas
  inner join usuarios
  on usuarios.id_usuario= reservas.id_usuario
  where fecha= $1
  order by hora
  ;
  `;
  try {
    const res = await pool.query(query, fecha);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

const selectEmailInConflict = async (hora) => {
  const query = `select email from reservas
  inner join usuarios
  on usuarios.id_usuario=reservas.id_usuario
  where hora=$1;`;
  try {
    const res = await pool.query(query, hora);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
const deleteHoursInConflict = async (hora) => {
  const query = `delete from reservas
  where hora=$1;`;
  try {
    const res = await pool.query(query, hora);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

const insertRoutine = async (data) => {
  const query = `INSERT INTO public.rutina
  (fecha_creacion,id_creador, nivel,nombre_rutina)
  VALUES($1, $2, $3,$4) returning id_rutina;
  `;
  try {
    const res = await pool.query(query, data);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

const insertExercises = async (data) => {
  const query = `INSERT INTO public.ejercicio
  (id_rutina,dia,num_orden, nombre_ejercicio, descripcion, repeticiones, series, descanso_segundos)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8);
  `;
  try {
    const res = await pool.query(query, data);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw error.message;
  }
};

const selectRoutinesRequest = async (data) => {
  const query = `select nombre_rutina, r.id_rutina,nombre_ejercicio ,descripcion ,repeticiones ,series ,descanso_segundos ,dia,num_orden ,r.fecha_creacion,nombre,apellido from ejercicio e
  inner join rutina r on r.id_rutina = e.id_rutina 
  inner join usuarios u  on u.id_usuario = r.id_creador 
  where r.fecha_aprobacion is null and r.fecha_eliminacion  is null`;
  try {
    const res = await pool.query(query, data);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

const aproveRoutineRequest = async (datos) => {
  const query = `UPDATE public.rutina
  SET fecha_aprobacion=$2
  WHERE id_rutina=$1;
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
const rejectRoutineRequest = async (datos) => {
  const query = `UPDATE public.rutina
  SET fecha_eliminacion=$2
  WHERE id_rutina=$1;
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

const selectRutinas = async () => {
  const query = `select ser.id_solicitud, ser.resolucion,ser.fecha , r.nivel, nombre_rutina, r.id_rutina,nombre_ejercicio ,descripcion ,repeticiones ,series ,descanso_segundos ,dia,num_orden ,r.fecha_creacion,nombre,apellido from ejercicio e
  inner join rutina r on r.id_rutina = e.id_rutina 
  inner join usuarios u  on u.id_usuario = r.id_creador
  full join solicitud_eliminacion_rutina ser on ser.id_rutina =r.id_rutina 
  where r.fecha_aprobacion is not null and r.fecha_eliminacion  is null order by num_orden asc;`;
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

const insertDeleteRequest = async (datos) => {
  const query = `INSERT INTO public.solicitud_eliminacion_rutina
  (id_rutina,id_entrenador, fecha)
  VALUES($1,$2,$3);
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
const deleteRoutinee = async (datos) => {
  const query = `UPDATE public.solicitud_eliminacion_rutina
  SET resolucion=true
  WHERE id_solicitud=$1 and id_rutina=$2;
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};
const updateDeleteRoutine = async (datos) => {
  const query = `UPDATE public.rutina
  SET fecha_eliminacion=$2
  WHERE id_rutina=$1;  
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

const selectRoutineActive = async (datos) => {
  const query = `UPDATE public.usuarios
  SET id_rutina=$1
  WHERE id_usuario=$2;
  ;  
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

const cambiarNivelUser = async (datos) => {
  const query = `UPDATE public.usuarios
  SET nivel_usuario=$1
  WHERE id_usuario=$2;
  `;
  try {
    const res = await pool.query(query, datos);
    return res.rows;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  cambiarNivelUser,
  selectRoutineActive,
  updateDeleteRoutine,
  deleteRoutinee,
  insertDeleteRequest,
  selectRutinas,
  aproveRoutineRequest,
  rejectRoutineRequest,
  selectRoutinesRequest,
  insertExercises,
  insertRoutine,
  deleteHoursInConflict,
  selectEmailInConflict,
  getReservesHour,
  registerAssistance,
  deletReserve,
  selectReserve,
  getDaysOff,
  selectAforoByDay,
  searchReservedHoursByDay,
  insertReserva,
  deleteBLoqueoHoras,
  getBLoqueoHoras,
  insertBLoqueoHoras,
  updateHorario,
  getHorarios,
  insertHorario,
  insertLogEmails,
  getEmailsEntrenados,
  getEmailsClientes,
  datosUsuarioPorId,
  traerMailById,
  traerTodosLosIdsClientes,
  selectClientesDeudores,
  selectPagos,
  montoTotalPagadoPorUser,
  updateEstadoFinanciero,
  selectSolicitudPago,
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
  pagoEfectivo,
  validarPago,
  mesesActivo,
  selectEstadoFinanciero,
  getEntranadosPorId,
};

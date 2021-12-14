const {
	enviarSolicitud,
	buscarUsuarioPorRutdeClientes,
	buscarUsuarioPorenSolicitudes,
} = require("../database/querys");
const moment = require("moment");

const envioSolicitud = async (req, res) => {
	const { name, lastName, date, adress, comuna, region, rut, email, pass1 } =
		req.body;
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

module.exports = {
	envioSolicitud,
};

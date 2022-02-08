const { pagoEfectivo } = require("../database/querys");
const moment = require("moment");

const ingresarPago = async (req, res) => {
    const body=req.body
    const fechaActual = moment().format("DD/MM/YYYY HH:mm");
    body.fecha=fechaActual
	try {
		const datos = await pagoEfectivo(Object.values(body));
		res.status(200).json({
			msg: "Pago registrado con éxito",
			ok: true,
		});
	} catch (error) {
		res.status(400).json({
			message: "Ha ocurrido un error",
			ok: false,
		});
	}
};

module.exports = {
    ingresarPago
};

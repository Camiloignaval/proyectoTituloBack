const nodemailer = require("nodemailer");

const enviarMail = async (tipo, correo, subject, datos) => {
	const transport = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.NODEMAILER_USER,
			pass: process.env.NODEMAILER_PASS,
		},
	});
	let email;
	if (tipo === "acept") {
		// SI ES APROBADO
		email = {
			from: `Tu gimnasio! <${process.env.NODEMAILER_USER}>`, //remitente
			to: correo, //destinatario
			subject, //asunto del correo
			text: ` 
         
           Estimado ${datos.nombre}
           Has sido aceptado para entrar en nuestra aplicación!
           Tus contraseña para ingresar es: ${datos.contraseña}
     
             
        `,
		};
	}
	// SI ES RECHAZADO
	else if (tipo === "reject") {
		email = {
			from: process.env.NODEMAILER_USER, //remitente
			to: correo, //destinatario
			subject, //asunto del correo
			text: ` 
            Estimado ${datos.nombre}
            Lamentablemente tu solicitud de usuario ha sido rechazada
            Puedes comunicarte con el administrador para mas información
           
        `,
		};
	} else if (tipo === "recordatorio") {
		email = {
			from: process.env.NODEMAILER_USER, //remitente
			to: correo, //destinatario
			subject, //asunto del correo
			text: ` 
            Estimad@ ${datos.nombre} ${datos.apellido}:
            ${datos.mensaje}
           
        `,
		};
	}
	let resp;
	await transport.sendMail(email, function (error, info) {
		if (error) {
			console.log("Error al enviar email", error);
			resp = "no";
		} else {
			console.log("Correo enviado correctamente a: ", info.accepted);
			resp = "ok";
		}
	});
	return resp;
};

module.exports = {
	enviarMail,
};

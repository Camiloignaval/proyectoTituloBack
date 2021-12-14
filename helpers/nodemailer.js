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
	}

	await transport.sendMail(email, function (error, info) {
		if (error) {
			console.log("Error al enviar email", error);
		} else {
			console.log("Correo enviado correctamente a: ", info.accepted);
		}
		// transport.close();
	});
};

module.exports = {
	enviarMail,
};

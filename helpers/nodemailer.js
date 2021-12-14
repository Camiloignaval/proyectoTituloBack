const nodemailer = require("nodemailer");

const jConfig = {
	host: "localhost",
	port: process.env.PORT,
	secure: false,
	auth: {
		type: "login",
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILES_PASS,
	},
};

const transport = nodemailer.createTransport(jConfig);

const enviarMail = (tipo, correo, subject, datos) => {
	let email;
	if (tipo === "acept") {
		// SI ES APROBADO
		email = {
			from: process.env.NODEMAILER_USER, //remitente
			to: correo, //destinatario
			subject, //asunto del correo
			html: ` 
            <div> 
            <p>Estimado ${datos.nombre}</p> 
            <p>Has sido aceptado para entrar en nuestra aplicación!</p> 
            <p>Tus contraseña para ingresar es: ${datos.pass}</p> 
     
            </div> 
        `,
		};
	}
	// SI ES RECHAZADO
	else if (tipo === "reject") {
		email = {
			from: process.env.NODEMAILER_USER, //remitente
			to: correo, //destinatario
			subject, //asunto del correo
			html: ` 
            <div> 
            <p>Estimado ${datos.nombre}</p> 
            <p>Lamentablemente tu solicitud de usuario ha sido rechazada</p> 
            <p>Puedes comunicarte con el administrador para mas información</p> 
            </div> 
        `,
		};
	}

	transport.sendMail(email, function (error, info) {
		if (error) {
			console.log("Error al enviar email");
		} else {
			console.log("Correo enviado correctamente");
		}
		transport.close();
	});
};

module.exports = {
	enviarMail,
};

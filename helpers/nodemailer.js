const nodemailer = require("nodemailer");

const enviarMail = async (
  tipo,
  to,
  subject,
  datos,
  de = process.env.NODEMAILER_USER
) => {
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
      from: `Tu gimnasio! <${process.env.NODEMAILER_USER}>`, // remitente
      to, // destinatario
      subject, // asunto del correo
      text: ` 
         
           Estimad@ ${datos.nombre}
           Has sido aceptado para entrar en nuestra aplicación!`,
    };
  } else if (tipo === "reject") {
    email = {
      from: process.env.NODEMAILER_USER, // remitente
      to, // destinatario
      subject, // asunto del correo
      text: ` 
            Estimad@ ${datos.nombre}
            Lamentablemente tu solicitud de usuario ha sido rechazada
            Puedes comunicarte con el administrador para mas información
           
        `,
    };
  } else if (tipo === "atrasados") {
    email = {
      from: process.env.NODEMAILER_USER, // remitente
      to, // destinatario
      subject, // asunto del correo
      text: ` 
            Estimad@ ${datos.nombre} ${datos.apellido}
            El motivo de este email, es para que porfavor te acerques al gimnasio a realizar
            el pago de tu mensualidad o via transferencia.

            De antemano muchas gracias!
           
        `,
    };
  } else if (tipo === "recordatorio") {
    email = {
      from: process.env.NODEMAILER_USER, // remitente
      to, // destinatario
      subject, // asunto del correo
      text: ` 
            Estimad@ ${datos.nombre} ${datos.apellido}:
            ${datos.mensaje}
           
        `,
    };
  } else if (tipo === "intercambio") {
    email = {
      from: de, // remitente
      to, // destinatario
      subject, // asunto del correo
      text: ` 
            Estimad@ ${datos.nombre} ${datos.apellido}, este es un mensaje enviado
            a través de aplicacion MyGym de parte de ${datos.datosRem.nombre} ${datos.datosRem.apellido}:
          
            ${datos.message}
           
        `,
    };
  } else if (tipo === "intercambioMasivoAdmin") {
    email = {
      from: de, // remitente
      to, // destinatario
      subject, // asunto del correo
      text: ` 
            ${datos.message}
           
        `,
    };
  } else if (tipo === "intercambioMasivoPersonal") {
    email = {
      from: de, // remitente
      to, // destinatario
      subject, // asunto del correo
      text: ` 
      Estimado usuario, este es un mensaje de parte de su entrenador personal:
            ${datos.message}
           
        `,
    };
  } else if (tipo === "cancelHora") {
    email = {
      from: de, // remitente
      to, // destinatario
      subject, // asunto del correo
      text: ` 
      Estimado usuario, debido a un inconveniente, hemos tenido que cancelar su actual reserva de las ${datos.hora}
           
        `,
    };
  }

  await transport.sendMail(email, function (error, info) {
    if (error) {
      console.log("Error al enviar email", error);
      return true;
    } else {
      console.log("Correo enviado correctamente a: ", info.accepted);
      return false;
    }
  });
};

module.exports = {
  enviarMail,
};

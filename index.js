const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
// cors
app.use(cors());

// lectura y parseo de body
app.use(express.json());

// directorio publico
app.use(express.static("public"));

// Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/msg", require("./routes/msg"));

// escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log(`Escuchando puerto ${process.env.PORT}`);
});

// mvc
// dependencias
const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// modelo
const modelo = require("./modelo.js");

//////////////////////////////////////////////////////////////////////////////////////////////7

// endpoint
app.get("/", (req, res) => {
  modelo.inicio("David", function (error, filas) {
    if (error) {
      return res.status(500).json({ error: "Ocurrio un error" });
    } else {
      return res.json(filas);
    }
  });
});

app.get("/verificar", function (req, res) {
  let email = req.query.email;
  let pass = req.query.pass;

  modelo.verificar(email, pass, function (error, filas) {
    if (error) {
      return res.status(500).json({ error: "Ocurrio un error" });
    } else {
      return res.json(filas);
    }
  });
});

app.post("/enviarCorreo", function (req, res) {
  var email = req.body.email;
  var token = req.body.token;

  modelo.enviarCorreo(email, token, function (err, filas) {
    if (err) {
      return res.status(500).json({ err: "Ocurrio un error" });
    } else {
      return res.json(filas);
    }
  });
});

app.get("/verificarToken", function(req, res) {
  const token = req.query.token; // Asegúrate de obtener el token de los parámetros de consulta

  modelo.verificartoken(token, (err, result) => {
    if (err) {
      return res.status(500).json({ err: "Ocurrió un error" });
    } 
    if (result.status === "fail") {
      return res.status(401).json({ mensaje: result.mensaje });
    }
    return res.json({ mensaje: "Token válido", datos: result.datos });
  });
});


//////////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

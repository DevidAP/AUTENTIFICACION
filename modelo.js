const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const password = require('.env')

let modelo = {};

var hostDB = "localhost";
var userDB = "root";
var passBD = "";
var databaseDB = "prueba";

modelo.inicio = function (nombre1, callback) {
  callback(null, { nombre: nombre1, status: "Conectado" });
};
modelo.verificar = function (email, pass, callback) {
  // validar correo y pass
  // var emailBD = 'david@gmail.com'
  // var passBD = '12345'

  // if (email == emailBD && pass == passBD ) {
  // callback(null,{ status: "ok", mensaje: 'Usuario encontrado'})

  // } else {
  // callback(null,{status: "fail", mensaje:'Error'})

  // }

  var conexion = mysql.createConnection({
    host: hostDB,
    user: userDB,
    pass: passBD,
    database: databaseDB,
  });
  conexion.connect((err) => {
    if (err) {
      console.log(err);
    }
  });
  if (conexion) {
    var consulta =
      "select * from usuarios where  correo ='" +
      email +
      "' and pass = '" +
      pass +
      " ' ";
    conexion.query(consulta, function (err, fila) {
      if (err) {
        console.log(err);
      } else {
        if (fila.length >= 1) {
          var token = jwt.sign({ email: email }, "claveToken2024");

          callback(null, {
            status: "ok",
            datos: fila,
            token: token,
            mensaje: "usuarios encontrados",
          });
        } else {
          callback(null, {
            status: "ok",
            datos: null,
            mensaje: "usuarios no encontrados",
          });
        }
      }
    });
  }
  conexion.end();
};
modelo.enviarCorreo = function (email, token, callback) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //protoclo envió de correos
    port: 465, //puerto de gmail
    secure: true,
    auth: {
      user: "arroyopichardo@gmail.com",
      pass: "password",
    },
  });

  let mailOptions = {
    //pondremos  la configuracion del gmail que va a recibir (from, to, etc)
    from: "axl.vallejo02@gmail.com",
    to: email,
    subject: "CONFIRMACION DEL CORREO",
    html:
      '<p>Has click en el siguiente link <a href ="http://localhost:3000/verificarToken?token=' +
      token +
      '">Has click aqui </a> </p>',
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Correo enviado correctamente ");
      callback(null, { status: "OK", mensaje: "Correo enviado exitosamente", token:token });
    }
  });
};
modelo.verificartoken = function (token, callback) {
  if (!token) {
    return callback(null, { status: "fail", mensaje: "Token no proporcionado" });
  }

  jwt.verify(token, "claveToken2024", (err, decoded) => {
    if (err) {
      return callback(null, { status: "fail", mensaje: "Token no válido" });
    }
    callback(null, { status: "ok", mensaje: "Token válido", datos: decoded });
  });
};
module.exports = modelo;


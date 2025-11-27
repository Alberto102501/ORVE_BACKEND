const mongoose = require('mongoose');
const User = require('../../models/managers/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createAccessToken = require('../../libs/jwt')
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuarios: ', error });
  }
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.createUser = async (req, res) => {
  const { name, username, password, module, status, typeUser, email } = req.body;
  console.log("Usuario SMTP:", process.env.SMTP_USER);
  console.log("Password SMTP:", process.env.SMTP_PASS ? "¡Sí existe!" : "Es undefined");
  try {
    // const passwordHash = await bcrypt.hash(password, 10); 

    const newUser = new User({ name, username, password/*: passwordHash*/, module, status, typeUser, email });
    const savedUser = await newUser.save();

    const rutaImagen = path.join(__dirname, '../../img/logo-fiscalia.png');
    try {
      await transporter.sendMail({
        from: '"Soporte ORVE" <avisosfgen@outlook.com>',
        to: email,
        subject: "Bienvenido al sistema ORVE",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="utf-8">
              <style>
                  /* Estilos generales para clientes que los soporten */
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                  .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                  .header { background-color: #2c3e50; padding: 20px; text-align: center; } /* Puedes cambiar el color del encabezado */
                  .content { padding: 30px; color: #333333; line-height: 1.6; }
                  .credentials-box { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px; padding: 15px; margin: 20px 0; }
                  .footer { background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777; }
                  .btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;}
              </style>
          </head>
          <body>
              <div style="background-color: #f4f4f4; padding: 40px 0;">
                  
                  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; font-family: Arial, sans-serif;">
                      
                      <div style="background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #007bff;">
                          <img src="cid:logo_empresa_header" alt="Logo ORVE" width="200" style="display: block; margin: 0 auto;" />
                      </div>

                      <div style="padding: 30px;">
                          <h1 style="color: #333; margin-top: 0; font-size: 24px; text-align: center;">¡Bienvenido, ${name}!</h1>
                          
                          <p style="color: #555; font-size: 16px; text-align: center;">
                              Tu cuenta para el sistema <strong>ORVE</strong> ha sido creada exitosamente. Ya puedes acceder a la plataforma.
                          </p>

                          <div style="background-color: #f0f4f8; border-left: 5px solid #007bff; padding: 20px; margin: 25px 0; border-radius: 4px;">
                              <p style="margin: 5px 10x; color: #333;"><strong>👤 Usuario:</strong> ${username}</p>
                              <p style="margin: 5px 0; color: #333;"><strong>🔑 Contraseña:</strong> <span style="font-family: monospace; background: #fff; padding: 2px 5px; border-radius: 3px;">${password}</span></p>
                          </div>

                          <p style="text-align: center; color: #777; font-size: 14px;">
                              <em>Por seguridad, te recomendamos no compartir la contraseña con nadie más</em>
                          </p>

                          <div style="text-align: center; margin-top: 30px;">
                              <a href="https://tudominio.com/login" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Ir al Sistema</a>
                          </div>
                      </div>

                      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
                          <p style="margin: 0;">Este es un mensaje automático del sistema ORVE.</p>
                          <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} FGEN.</p>
                      </div>

                  </div>
                  </div>
          </body>
          </html>
            `,
        attachments: [
          {
            filename: 'logo.png', // El nombre que tendrá el archivo internamente
            path: rutaImagen,     // La ruta absoluta que calculamos arriba con path.join
            cid: 'logo_empresa_header' // ¡IMPORTANTE! Debe ser IDÉNTICO al que pusiste en el HTML
          }
        ]
      });
      console.log(`Correo de bienvenida enviado a ${username}`);
    } catch (emailError) {
      // Si falla el correo, NO queremos que falle la creación del usuario.
      // Solo lo registramos en consola.
      console.error("El usuario se creó, pero falló el envío del correo:", emailError);
    }

    // const token = await createAccessToken({id: savedUser._id});

    // res.cookie('token', token);
    // res.json({message: 'Usuario creado exitosamente'});

    res.status(200).json({ success: true, data: savedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear usuario', error });
  }
}

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, update, {
      new: true,              // Devuelve el documento actualizado
      runValidators: true     // Aplica validaciones del esquema
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar usuario', error });
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userFound = await User.findOne({ username });
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado." });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie('token', token);

    res.status(200).json({ success: true, data: userFound.username });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear usuario', error });
  }
}

exports.logout = (req, res) => {
  res.cookie('token', "", {
    expires: new Date(0)
  });
  return res.sendStatus(200);
}
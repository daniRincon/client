const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Origen de tu aplicación cliente
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

// Servir archivos estáticos desde la carpeta build de React
app.use(express.static(path.join(__dirname, 'client/build')));

// Configuración del puerto serial en COM6
const port = new SerialPort({
  path: 'COM5',
  baudRate: 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
  console.log('Puerto serial abierto');
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Conexión de Socket.io
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');
});

// Manejar los datos del puerto serial
parser.on('data', (data) => {
  console.log('Dato recibido:', data);
  io.emit('ecg_data', data);
});

// Parse URL-encoded bodies (como los enviados por formularios HTML)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (como los enviados por clientes API)
app.use(express.json());

// Ruta para obtener recomendaciones basadas en el ritmo cardíaco
app.post('/recommendations', (req, res) => {
  console.log('POST request received');
  const requestData = req.body;
  console.log('Request data:', requestData);

  const prompt = `Mira el vector de frecuencia cardíaca y realiza una recomendación detallada. heart_rate_vector = ${requestData['heart_rate']}. Solo responde el texto sin formato`;

  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    'Authorization': `Bearer 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`,
    'Content-Type': 'application/json',
  };
  const data = {
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful medical assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  };

  axios.post(url, data, { headers: headers })
    .then(response => {
      console.log(response.data.choices[0].message.content);
      res.json({ recommendation: response.data.choices[0].message.content });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching recommendations');
    });
});

// Manejar cualquier solicitud que no coincida con las rutas anteriores
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Manejo de errores para el puerto serial
port.on('error', function (err) {
  console.log('Error en el puerto serial: ', err.message);
});
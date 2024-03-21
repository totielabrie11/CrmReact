const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());
// Para analizar cuerpos de tipo application/json
app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed for this origin'));
        }
    },
    methods: ['GET', 'POST'],
}));


// Para analizar cu',e'rpos de tipo applicat'ion/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

  

// Verificar la existencia del directorio data, si no existe, crearlo
const dataDirPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataDirPath)) {
    fs.mkdirSync(dataDirPath, { recursive: true });
}

const eventosFilePath = path.join(dataDirPath, 'eventos.json');
const vendedoresFilePath = path.join(dataDirPath, 'vendedores.json');
const usersFilePath = path.join(dataDirPath, 'us.json');

// Función para verificar o crear los archivos JSON
const verificarOCrearArchivoJSON = (filePath, defaultData = '[]') => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, defaultData, 'utf-8');
    }
};

// Verificar o crear los archivos al iniciar el servidor
verificarOCrearArchivoJSON(eventosFilePath);
verificarOCrearArchivoJSON(vendedoresFilePath);

// Endpoints aquí

// Endpoint para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo de usuarios');
            return;
        }
        
        const users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            res.status(200).json({ message: 'Login exitoso', user });
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    });
});


// Endpoint para crear un evento
app.post('/eventos', (req, res) => {
    const newEvent = req.body;

    fs.readFile(eventosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo de eventos');
            return;
        }
        
        const eventos = JSON.parse(data);
        
        // Encontrar el ID máximo existente
        const maxId = eventos.reduce((acc, event) => event.id > acc ? event.id : acc, 0);
        
        // Asignar el nuevo ID incrementado en 1
        newEvent.id = maxId + 1;

        // Añadir el nuevo evento al array de eventos
        eventos.push(newEvent);

        // Guardar de nuevo el archivo eventos.json
        fs.writeFile(eventosFilePath, JSON.stringify(eventos, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al guardar el evento');
                return;
            }
            res.status(201).json({ message: 'Evento guardado con éxito', id: newEvent.id });
        });
    });
});

// Endpoint para obtener todos los eventos
app.get('/eventos', (req, res) => {
    fs.readFile(eventosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo de eventos');
            return;
        }
        
        const eventos = JSON.parse(data);
        res.status(200).json(eventos);
    });
});

// Endpoint para crear un vendedor
app.post('/vendedores', (req, res) => {
    const newSeller = req.body;

    fs.readFile(vendedoresFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo de vendedores');
            return;
        }
        
        let vendedores = JSON.parse(data);
        
        // Calcular el nuevo ID
        const maxId = vendedores.reduce((acc, seller) => seller.id > acc ? seller.id : acc, 0);
        newSeller.id = maxId + 1;
        
        // Añadir el nuevo vendedor al array de vendedores
        vendedores.push(newSeller);

        // Guardar de nuevo el archivo vendedores.json
        fs.writeFile(vendedoresFilePath, JSON.stringify(vendedores, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al guardar el vendedor');
                return;
            }
            res.status(201).json({ message: 'Vendedor guardado con éxito', seller: newSeller });
        });
    });
});

// Endpoint para obtener la lista de vendedores
app.get('/vendedores', (req, res) => {
    fs.readFile(vendedoresFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de vendedores:', err);
            return res.status(500).send('Error al leer el archivo de vendedores');
        }

        try {
            const vendedores = JSON.parse(data);
            res.status(200).json(vendedores); // Envía la lista de vendedores al cliente
        } catch (error) {
            console.error('Error al parsear los vendedores:', error);
            res.status(500).send('Error al procesar los datos de vendedores');
        }
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

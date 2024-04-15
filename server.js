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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
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
const clientsFilePath  = path.join(dataDirPath, 'clientes.json');

// Función para verificar o crear los archivos JSON
const verificarOCrearArchivoJSON = (filePath, defaultData = '[]') => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, defaultData, 'utf-8');
    }
};

// Verificar o crear los archivos al iniciar el servidor
verificarOCrearArchivoJSON(clientsFilePath);
verificarOCrearArchivoJSON(eventosFilePath);
verificarOCrearArchivoJSON(vendedoresFilePath);

// Endpoints aquí

// Endpoint para iniciar sesión
// Endpoint para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo de usuarios", err);
            res.status(500).send('Error al leer el archivo de usuarios');
            return;
        }
        
        const users = JSON.parse(data);
        console.log("Usuarios cargados para autenticación:", users); // Log para debug: muestra todos los usuarios cargados

        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            console.log("Usuario autenticado con éxito:", user); // Log para debug: muestra el usuario autenticado
            res.status(200).json({ message: 'Login exitoso', user });
        } else {
            console.log("Fallo de autenticación para usuario:", username); // Log para debug: intento fallido de autenticación
            res.status(401).send('Credenciales incorrectas');
        }
    });
});


// Endpoint para obtener todos los eventos, con opción de filtrar por sellerId y status
app.get('/eventos', (req, res) => {
    fs.readFile(eventosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al leer el archivo de eventos');
        }

        let eventos = JSON.parse(data);
        const { sellerId, status } = req.query;

        // Filtrar eventos por sellerId y status si se proporcionan
        if (sellerId) {
            eventos = eventos.filter(evento => evento.sellerId.toString() === sellerId);
        }
        if (status) {
            eventos = eventos.filter(evento => evento.status === status);
        }

        res.status(200).json(eventos);
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



// Endpoint para actualizar la nota de un evento específico
app.put('/eventos/:id/updateNote', (req, res) => {
    const { id } = req.params; // ID del evento a actualizar
    const { text, date } = req.body; // Datos de la nota

    fs.readFile(eventosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de eventos', err);
            return res.status(500).send('Error al procesar la solicitud');
        }

        let eventos = JSON.parse(data);
        const eventoIndex = eventos.findIndex(evento => evento.id.toString() === id);

        if (eventoIndex === -1) {
            return res.status(404).send('Evento no encontrado');
        }

        // Si el evento tiene ya un campo de notas, lo actualizamos. Si no, lo creamos.
        if (!eventos[eventoIndex].notes) {
            eventos[eventoIndex].notes = [];
        }
        eventos[eventoIndex].notes.push({ text, date });

        fs.writeFile(eventosFilePath, JSON.stringify(eventos, null, 2), (err) => {
            if (err) {
                console.error('Error al actualizar el evento', err);
                return res.status(500).send('Error al guardar los cambios');
            }
            res.status(200).json({ message: 'Nota actualizada con éxito', evento: eventos[eventoIndex] });
        });
    });
});

// Update task status
app.put('/eventos/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const eventosData = await fs.promises.readFile(eventosFilePath, 'utf8');
        let eventos = JSON.parse(eventosData);
        let eventFound = false;

        eventos = eventos.map(event => {
            if (event.id === Number(id)) {
                eventFound = true;
                return { ...event, status };
            }
            return event;
        });

        if (!eventFound) {
            return res.status(404).send('Evento no encontrado');
        }

        await fs.promises.writeFile(eventosFilePath, JSON.stringify(eventos, null, 2));
        res.status(200).json({ message: "Estado del evento actualizado con éxito" });
    } catch (err) {
        console.error('Error al actualizar el evento:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});



// Endpoint para crear un vendedor y un usuario asociado
app.post('/vendedores', async (req, res) => {
    const newSeller = req.body;

    try {
        const [vendedoresData, usersData] = await Promise.all([
            fs.promises.readFile(vendedoresFilePath, 'utf8'),
            fs.promises.readFile(usersFilePath, 'utf8')
        ]);

        const vendedores = JSON.parse(vendedoresData);
        const users = JSON.parse(usersData);

        const maxVendedorId = vendedores.reduce((max, { id }) => Math.max(max, Number(id) || 0), 0);
        const maxUserId = users.reduce((max, { id }) => Math.max(max, Number(id) || 0), 0);
        const newId = Math.max(maxVendedorId, maxUserId) + 1;

        newSeller.id = newId;

        vendedores.push(newSeller);
        await fs.promises.writeFile(vendedoresFilePath, JSON.stringify(vendedores, null, 2));

        const newUser = {
            id: newId.toString(),
            username: newSeller.nombre,
            password: "",
            type: "vendedor"
        };

        users.push(newUser);
        await fs.promises.writeFile(usersFilePath, JSON.stringify(users, null, 2));

        res.status(201).json({ message: 'Vendedor y usuario creados exitosamente', newSeller, newUser });
    } catch (err) {
        console.error('Error procesando la solicitud:', err);
        res.status(500).send('Error al procesar la solicitud');
    }
});


// Endpoint para obtener la lista de vendedores
app.get('/vendedores', (req, res) => {
    fs.readFile(vendedoresFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de vendedores:', err);
            res.status(500).send('Error al leer el archivo de vendedores');
            return;
        }

        try {
            const vendedores = JSON.parse(data);
            res.status(200).json(vendedores);
        } catch (error) {
            console.error('Error al parsear los vendedores:', error);
            res.status(500).send('Error al procesar los datos de vendedores');
        }
    });
});

//Este endpoint actualiza un vendedor existente basado en su ID.
app.put('/vendedores/:id', (req, res) => {
    const { id } = req.params;
    const sellerUpdates = req.body;
    fs.readFile(vendedoresFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de vendedores');
            return;
        }
        let vendedores = JSON.parse(data);
        const index = vendedores.findIndex(s => s.id === parseInt(id));
        if (index === -1) {
            res.status(404).send('Vendedor no encontrado');
            return;
        }
        vendedores[index] = { ...vendedores[index], ...sellerUpdates };
        fs.writeFile(vendedoresFilePath, JSON.stringify(vendedores, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error al actualizar el vendedor');
                return;
            }
            res.status(200).send(vendedores[index]);
        });
    });
});

//Este endpoint elimina un vendedor basado en su ID.
app.delete('/vendedores/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(vendedoresFilePath, (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de vendedores');
            return;
        }
        let vendedores = JSON.parse(data);
        const index = vendedores.findIndex(s => s.id === parseInt(id));
        if (index === -1) {
            res.status(404).send('Vendedor no encontrado');
            return;
        }
        vendedores.splice(index, 1);
        fs.writeFile(vendedoresFilePath, JSON.stringify(vendedores, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error al eliminar el vendedor');
                return;
            }
            res.status(200).send('Vendedor eliminado');
        });
    });
});



// Endpoint para verificar la existencia de un evento en un horario específico
app.get('/eventos/verificar', (req, res) => {
    const { date, time, sellerId } = req.query; // Obtiene la fecha, hora y sellerId de los parámetros de consulta

    fs.readFile(eventosFilePath, (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de eventos:', err);
            return res.status(500).send('Error al leer el archivo de eventos');
        }

        const eventos = JSON.parse(data);
        // Buscar si existe algún evento con la misma fecha, hora y sellerId
        const eventoExistente = eventos.some(evento => evento.date === date && evento.time === time && evento.sellerId === sellerId);

        if (eventoExistente) {
            // Si encuentra un evento existente para el mismo vendedor, responde indicando que el horario ya fue asignado
            res.json({ exists: true });
        } else {
            // Si no hay eventos en ese horario para el mismo vendedor, indica que el horario está disponible
            res.json({ exists: false });
        }
    });
});

//Endpoint para Listar Todos los Clientes
app.get('/clientes', (req, res) => {
    fs.readFile(clientsFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de clientes');
        }
        const clientes = JSON.parse(data);
        res.status(200).json(clientes);
    });
});

//Enpoint que obtiene clientes por ID
app.get('/clientes/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(clientsFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de clientes');
        }
        const clientes = JSON.parse(data);
        const cliente = clientes.find(c => c.id === Number(id));
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).send('Cliente no encontrado');
        }
    });
});

//Endpoint, para crear un Nuevo Cliente
app.post('/clientes', (req, res) => {
    const newClient = req.body;
    fs.readFile(clientsFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de clientes');
        }
        const clientes = JSON.parse(data);
        newClient.id = clientes.length + 1; // Simple ID assignment
        clientes.push(newClient);
        fs.writeFile(clientsFilePath, JSON.stringify(clientes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al guardar el nuevo cliente');
            }
            res.status(201).json(newClient);
        });
    });
});

//Enpoint para actualizar un Cliente Existente
app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(clientsFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de clientes');
        }
        let clientes = JSON.parse(data);
        const index = clientes.findIndex(c => c.id === Number(id));
        if (index === -1) {
            return res.status(404).send('Cliente no encontrado');
        }
        clientes[index] = {...clientes[index], ...req.body};
        fs.writeFile(clientsFilePath, JSON.stringify(clientes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al actualizar el cliente');
            }
            res.status(200).json(clientes[index]);
        });
    });
});

//Enpoint para eliminar un Cliente
app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(clientsFilePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo de clientes');
        }
        let clientes = JSON.parse(data);
        const index = clientes.findIndex(c => c.id === Number(id));
        if (index === -1) {
            return res.status(404).send('Cliente no encontrado');
        }
        clientes.splice(index, 1);
        fs.writeFile(clientsFilePath, JSON.stringify(clientes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al eliminar el cliente');
            }
            res.status(200).send('Cliente eliminado');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

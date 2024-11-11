// Importación de módulos
const path = require('path');   // Para ejecutar desde index.html

const express = require('express');
const connection = require('./conexion');
const { error } = require('console');

// Inicialización de la aplicación Express
const app = express();
app.use(express.json());  // Middleware para parsear solicitudes con formato JSON

app.use(express.urlencoded({ extended: true }));
// Servir el archivo index.html
app.use(express.static(path.join(__dirname, 'template')));

// Ruta GET para verificar el estado de la API
app.get('/api/prueba', (req, res) => {
    res.send("La API esta funcionando bien....");
});

/** Ruta GET de prueba
 * Devuelve un mensaje y detalles adicionales como el puerto y el estado de la respuesta */
app.get('/api/prueba1', (req, res) => {  // Corrección de sintaxis en la ruta '/api/prueba1' (faltaba '/')
    const PORT = 3001;  // Definición del puerto utilizado para referenciarlo en la respuesta
    res.status(200).json({
        message: 'La API responde bien..',
        port: PORT,
        status: 'success'
    });
});

// Consultar los registros de la Tabla
app.get('/api/obtener', (req, res) => {
    const query = "SELECT * FROM  formularios";
    connection.query(query, (error, result) => {

        if (error) {
            res.status(500).json({
                success: false,
                message: "Error de recuperacion datos",
                datails: error.message
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Datos de la tabla",
                data: result
            });
            //res.json(result);
        }
    })
});
/* Crear api POST */
// Ruta POST para guardar un registro en la base de datos
app.post('/api/guardar', (req, res) => {  // Eliminación de la barra adicional en '/api/guardar/'
    const { cedula, nombre, celular, email, fecha } = req.body;

    // Consulta SQL para insertar una nueva persona en la tabla 'persona'
    const sql = 'INSERT INTO formularios(cedula, nombre, celular, email, fecha) VALUES(?,?,?,?,?)';
    connection.query(sql, [cedula, nombre, celular, email, fecha], (error, result) => {  // Corrección de sintaxis al pasar parámetros a connection.query()

        if (error) {
            res.status(500).json({ error });
        } else {
            res.status(201).json({ cedula: result.insertId, nombre, celular, email, fecha });
        }
    });
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.put('/api/actualizar/:cedula', (req, res) => {
    const { cedula } = req.params;
    const { nombre, celular, email, fecha } = req.body;

    // Validación para asegurar que el campo 'cedula' esté presente
    if (!cedula) {
        return res.status(400).json({ error: "El campo 'cedula' es obligatorio para la actualización." });
    }
    const query = 
    `UPDATE formularios 
    SET 
    nombre = COALESCE(?, nombre),
    celular = COALESCE(?, celular), 
    email = COALESCE(?, email), 
    fecha = COALESCE(?, fecha)
    WHERE cedula = ? `;

    //const sql = 'UPDATE formularios SET nombre = ?, celular = ?, email = ? , fecha = ? WHERE cedula = ?';
    connection.query(query, [cedula, nombre, celular, email, fecha], (error, result) => {
        if (error) {
            res.status(500).json({ error });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: "No se encontró una persona con la cedula proporcionada." });
        } else {
            res.status(200).json({ message: "Registro actualizado exitosamente", cedula, nombre, celular, email, fecha });
        }
    });
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.delete('/api/eliminar/:cedula', (req, res) => {
    const { cedula } = req.params;

    // Validación para asegurar que el campo 'cedula' esté presente
    if (!cedula) {
        return res.status(400).json({ error: "El campo 'cedula' es obligatorio para el borrado." });
    }

    const query = 'DELETE FROM formularios WHERE cedula = ?';
    connection.query(query, [cedula], (error, result) => {
        if (error) {
            res.status(500).json({ error });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: "No se encontró una persona con la cedula proporcionada." });
        } else {
            res.status(200).json({ message: `Registro Borrado exitosamente: ${cedula}` });
        }
    });
});
// APIS Compras

// Consultar los registros de la Tabla
app.get('/api/obtener1', (req, res) => {
    const query = "SELECT * FROM  compras";
    connection.query(query, (error, result) => {

        if (error) {
            res.status(500).json({
                success: false,
                message: "Error de recuperacion datos",
                datails: error.message
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Datos de la tabla",
                data: result
            });
            //res.json(result);
        }
    })
});
/* Crear api POST */
// Ruta POST para guardar un registro en la base de datos
app.post('/api/guardar1', (req, res) => {  // Eliminación de la barra adicional en '/api/guardar/'
    const { cedula, nombre, celular, email, planta } = req.body;

    // Consulta SQL para insertar una nueva persona en la tabla 'persona'
    const sql = 'INSERT INTO compras(cedula, nombre, celular, email, planta) VALUES(?,?,?,?,?)';
    connection.query(sql, [cedula, nombre, celular, email, planta], (error, result) => {  // Corrección de sintaxis al pasar parámetros a connection.query()

        if (error) {
            res.status(500).json({ error });
        } else {
            res.status(201).json({ cedula: result.insertId, cedula, nombre, celular, email, planta });
        }
    });
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.put('/api/actualizar1/:cedula', (req, res) => {
    const { cedula } = req.params;
    const { nombre, celular, email, planta } = req.body;

    // Validación para asegurar que el campo 'cedula' esté presente
    if (!cedula) {
        return res.status(400).json({ error: "El campo 'cedula' es obligatorio para la actualización." });
    }
    const query = 
    `UPDATE compras 
    SET 
    nombre = COALESCE(?, nombre),
    celular = COALESCE(?, celular),
    email = COALESCE(?, email), 
    planta = COALESCE(?, planta) 
    WHERE cedula = ? `;

    //const sql = 'UPDATE compras SET nombre = ?, email = ? , planta = ? WHERE cedula = ?';
    connection.query(query, [cedula, nombre, celular, email, planta], (error, result) => {
        if (error) {
            res.status(500).json({ error });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: "No se encontró una persona con la cedula proporcionada." });
        } else {
            res.status(200).json({ message: "Registro actualizado exitosamente", cedula, nombre, email, planta });
        }
    });
});

// Nueva ruta PUT para actualizar un registro en la base de datos
app.delete('/api/eliminar1/:cedula', (req, res) => {
    const { cedula } = req.params;

    // Validación para asegurar que el campo 'cedula' esté presente
    if (!cedula) {
        return res.status(400).json({ error: "El campo 'cedula' es obligatorio para el borrado." });
    }

    const query = 'DELETE FROM compras WHERE cedula = ?';
    connection.query(query, [cedula], (error, result) => {
        if (error) {
            res.status(500).json({ error });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: "No se encontró una persona con la cedula proporcionada." });
        } else {
            res.status(200).json({ message: `Registro Borrado exitosamente: ${cedula}` });
        }
    });
});

// Configuración del puerto y mensaje de conexión
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

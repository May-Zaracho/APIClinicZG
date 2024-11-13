// Importa el módulo 'express' para crear y configurar el servidor
const express = require('express');
// Importa el módulo 'fs' para trabajar con el sistema de archivos (leer y escribir archivos)
const fs = require('fs');
// Crea una aplicación Express
const app = express();

// Configura el servidor para que acepte y procese datos en formato JSON en las solicitudes
app.use(express.json());
// Define el puerto en el que se ejecutará el servidor
const port = 3000;

// Función para leer un archivo JSON y devolver su contenido como objeto JavaScript
function readJsonFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer el archivo ${filename}:`, error);
        return null;
    }
}

// Función para escribir datos en un archivo JSON, guardando los datos proporcionados
function writeJsonFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`Archivo ${filename} actualizado exitosamente.`);
    } catch (error) {
        console.error(`Error al escribir en el archivo ${filename}:`, error);
    }
}

// Define los nombres de los archivos JSON que almacenan los datos de cada recurso
const pacientesFile = 'Pacientes.json';
const medicosFile = 'Medicos.json';
const citasFile = 'Citas.json';
const habitacionesFile = 'Habitaciones.json';

// Ruta para agregar un paciente
app.post("/agregarPaciente", (req, res) => {
    const data = req.body; // Recibe los datos del nuevo paciente desde la solicitud
    let listadoPacientes = readJsonFile(pacientesFile) || { pacientes: [] }; // Carga la lista actual de pacientes

    // Verifica si el paciente ya existe en el archivo usando el DNI
    const pacienteExistente = listadoPacientes.pacientes.find(paciente => paciente.dni === data.dni);

    if (pacienteExistente) {
        res.status(400).send({ message: "El paciente ya existe" });
    } else {
        data.estado = "activo"; // Define el estado del paciente como "activo"
        listadoPacientes.pacientes.push(data); // Agrega el nuevo paciente a la lista
        writeJsonFile(pacientesFile, listadoPacientes); // Guarda los cambios en el archivo
        res.send({ mensaje: "Paciente agregado exitosamente.", paciente: data });
    }
});

// Ruta para actualizar los datos de un paciente
app.put('/pacientes/:dni', (req, res) => {
    const { dni } = req.params; // Obtiene el DNI del paciente de los parámetros de la URL
    const data = req.body; // Recibe los datos actualizados desde la solicitud
    let listadoPacientes = readJsonFile(pacientesFile) || { pacientes: [] };

    // Encuentra el índice del paciente con el DNI especificado
    const pacienteIndex = listadoPacientes.pacientes.findIndex(paciente => paciente.dni === dni);

    if (pacienteIndex !== -1) {
        listadoPacientes.pacientes[pacienteIndex] = { ...listadoPacientes.pacientes[pacienteIndex], ...data }; // Actualiza los datos
        writeJsonFile(pacientesFile, listadoPacientes); // Guarda los cambios
        res.send({ mensaje: "Paciente actualizado exitosamente.", paciente: listadoPacientes.pacientes[pacienteIndex] });
    } else {
        res.status(404).send({ mensaje: "Paciente no encontrado." });
    }
});

// Ruta para obtener la lista de pacientes activos
app.get('/pacientes', (req, res) => {
    let listadoPacientes = readJsonFile(pacientesFile) || { pacientes: [] };
    res.json(listadoPacientes.pacientes.filter(paciente => paciente.estado === "activo")); // Filtra solo los pacientes activos
});

// Ruta para desactivar un paciente (cambiar su estado a "inactivo")
app.delete('/pacientes/:dni', (req, res) => {
    const { dni } = req.params;
    let listadoPacientes = readJsonFile(pacientesFile) || { pacientes: [] };

    const pacienteIndex = listadoPacientes.pacientes.findIndex(paciente => paciente.dni === dni);

    if (pacienteIndex !== -1) {
        listadoPacientes.pacientes[pacienteIndex].estado = "inactivo"; // Marca al paciente como inactivo
        writeJsonFile(pacientesFile, listadoPacientes);
        res.send({ mensaje: "Paciente desactivado exitosamente." });
    } else {
        res.status(404).send({ mensaje: "Paciente no encontrado." });
    }
});

// Ruta para agregar un médico
app.post("/agregarMedico", (req, res) => {
    const data = req.body;
    let listadoMedicos = readJsonFile(medicosFile) || { medicos: [] };

    const medicoExistente = listadoMedicos.medicos.find(medico => medico.id === data.id);

    if (medicoExistente) {
        res.status(400).send({ message: "El médico ya existe" });
    } else {
        data.estado = "activo";
        listadoMedicos.medicos.push(data);
        writeJsonFile(medicosFile, listadoMedicos);
        res.send({ mensaje: "Médico agregado exitosamente.", medico: data });
    }
});

// Ruta para actualizar los datos de un médico
app.put('/medicos/:id', (req, res) => {
    const { id } = req.params;
    const data = req.body;
    let listadoMedicos = readJsonFile(medicosFile) || { medicos: [] };

    const medicoIndex = listadoMedicos.medicos.findIndex(medico => medico.id === id);

    if (medicoIndex !== -1) {
        listadoMedicos.medicos[medicoIndex] = { ...listadoMedicos.medicos[medicoIndex], ...data };
        writeJsonFile(medicosFile, listadoMedicos);
        res.send({ mensaje: "Médico actualizado exitosamente.", medico: listadoMedicos.medicos[medicoIndex] });
    } else {
        res.status(404).send({ mensaje: "Médico no encontrado." });
    }
});

// Ruta para obtener la lista de médicos activos
app.get('/medicos', (req, res) => {
    let listadoMedicos = readJsonFile(medicosFile) || { medicos: [] };
    res.json(listadoMedicos.medicos.filter(medico => medico.estado === "activo"));
});

// Ruta para desactivar un médico
app.delete('/medicos/:id', (req, res) => {
    const { id } = req.params;
    let listadoMedicos = readJsonFile(medicosFile) || { medicos: [] };

    const medicoIndex = listadoMedicos.medicos.findIndex(medico => medico.id === id);

    if (medicoIndex !== -1) {
        listadoMedicos.medicos[medicoIndex].estado = "inactivo";
        writeJsonFile(medicosFile, listadoMedicos);
        res.send({ mensaje: "Médico desactivado exitosamente." });
    } else {
        res.status(404).send({ mensaje: "Médico no encontrado." });
    }
});

// Rutas similares para citas y habitaciones

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

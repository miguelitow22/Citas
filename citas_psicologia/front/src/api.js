import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Aquí puedes ajustar la URL si tu backend está en otro puerto.

// Función para registrar un usuario
export const registerUser = (nombre, email, contraseña) => {
    return axios.post(`${API_URL}/auth/register`, { nombre, email, contraseña });
};

// Función para iniciar sesión
export const loginUser = (email, contraseña) => {
    return axios.post(`${API_URL}/auth/login`, { email, contraseña });
};

// Función para obtener las citas
export const getCitas = (token) => {
    return axios.get(`${API_URL}/citas`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

// Función para crear una cita
export const createCita = (token, fecha_cita, notas) => {
    return axios.post(`${API_URL}/citas`, { fecha_cita, notas }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

import React, { useState, useEffect } from 'react';
import '../Citas.css';

const Citas = ({ token }) => {
  const [citas, setCitas] = useState([]);
  const [nuevaCita, setNuevaCita] = useState('');
  const [fechaCita, setFechaCita] = useState('');
  const [estado, setEstado] = useState('pendiente'); // Estado de la cita
  const [notas, setNotas] = useState('');
  const [editando, setEditando] = useState(false);
  const [idCitaEditando, setIdCitaEditando] = useState(null);

  // Función para obtener las citas
  const obtenerCitas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/citas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCitas(data);
    } catch (error) {
      console.error('Error al obtener citas:', error);
    }
  };

  // Llamamos a obtenerCitas cuando el componente se monta
  useEffect(() => {
    obtenerCitas();
  }, [token]);

  // Función para agregar una nueva cita
  const agregarCita = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha_cita: fechaCita,
          estado: estado,
          notas: notas,
        }),
      });
      if (response.ok) {
        setNuevaCita('');
        setFechaCita('');
        setEstado('pendiente');
        setNotas('');
        obtenerCitas();
      } else {
        console.error('Error al agregar la cita');
      }
    } catch (error) {
      console.error('Error al agregar la cita:', error);
    }
  };

  // Función para editar una cita
  const editarCita = (id, cita) => {
    setIdCitaEditando(id);
    setNuevaCita(cita.cita); // Si tu base de datos almacena citas de esta manera, usa esa propiedad
    setFechaCita(cita.fecha_cita);
    setEstado(cita.estado);
    setNotas(cita.notas);
    setEditando(true);
  };

  // Función para actualizar la cita
  const actualizarCita = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/citas/${idCitaEditando}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha_cita: fechaCita,
          estado: estado,
          notas: notas,
        }),
      });
      if (response.ok) {
        setNuevaCita('');
        setFechaCita('');
        setEstado('pendiente');
        setNotas('');
        setEditando(false);
        setIdCitaEditando(null);
        obtenerCitas();
      } else {
        console.error('Error al actualizar la cita');
      }
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  };

  // Función para eliminar una cita
  const eliminarCita = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/citas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        obtenerCitas();
      } else {
        console.error('Error al eliminar la cita');
      }
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  return (
    <div className="citas-container">
      <h2>Citas</h2>
      <form onSubmit={editando ? actualizarCita : agregarCita} className="form-cita">
        <input
          type="datetime-local"
          value={fechaCita}
          onChange={(e) => setFechaCita(e.target.value)}
          placeholder="Fecha y hora de la cita"
          className="form-input"
          required
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="form-input"
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas sobre la cita"
          className="form-input"
        />
        <button type="submit" className="btn-submit">
          {editando ? 'Actualizar cita' : 'Agregar cita'}
        </button>
      </form>

      <div className="citas-lista">
        {citas.length === 0 ? (
          <p>No tienes citas programadas.</p>
        ) : (
          citas.map((cita) => (
            <div key={cita.id_cita} className="cita-item">
              <p><strong>Fecha:</strong> {cita.fecha_cita}</p>
              <p><strong>Estado:</strong> {cita.estado}</p>
              <p><strong>Notas:</strong> {cita.notas}</p>
              <div className="acciones">
                <button onClick={() => editarCita(cita.id_cita, cita)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarCita(cita.id_cita)} className="btn-eliminar">Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Citas;

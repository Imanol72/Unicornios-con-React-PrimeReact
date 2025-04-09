import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [unicorns, setUnicorns] = useState([]);
  const [useForm, setUseForm] = useState({
    name: '',
    color: '',
    age: 0,
    power: '',
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'https://crudcrud.com/api/c41bb1175c464f37bb0a7bd84e101f4e/unicorns';

  // Cargar los unicornios existentes
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setUnicorns(data);
      })
      .catch((error) => {
        console.error('Error al traer los unicornios:', error);
      });
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUseForm((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value,
    }));
  };

  // Crear o actualizar unicornio
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!useForm.name || !useForm.color || !useForm.power || useForm.age <= 0) {
      alert('Completá todos los campos correctamente.');
      return;
    }

    try {
      if (editingId) {
        // PUT (actualizar)
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(useForm),
        });

        if (!res.ok) throw new Error('Error al actualizar unicornio');

        setUnicorns((prev) =>
          prev.map((u) => (u._id === editingId ? { ...useForm, _id: editingId } : u))
        );
        setEditingId(null);
      } else {
        // POST (crear)
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(useForm),
        });

        const json = await res.json();
        setUnicorns((prev) => [...prev, json]);
        localStorage.setItem('objectId', json._id);
        localStorage.setItem('objectName', json.name);
      }

      // Resetear formulario
      setUseForm({ name: '', color: '', age: 0, power: '' });
    } catch (err) {
      console.error('Error al guardar unicornio:', err);
    }
  };

  // Eliminar unicornio
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setUnicorns((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error('Error al eliminar unicornio:', err);
    }
  };

  // Cargar unicornio al form para editar
  const handleEdit = (u) => {
    setUseForm({
      name: u.name,
      color: u.color,
      age: u.age,
      power: u.power,
    });
    setEditingId(u._id);
  };

  return (
    <div className="App">
      <h1>{editingId ? 'Editar Unicornio' : 'Crear Unicornio'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nombre"
          value={useForm.name}
          onChange={handleChange}
        />
        <input
          name="color"
          placeholder="Color"
          value={useForm.color}
          onChange={handleChange}
        />
        <input
          name="age"
          type="number"
          placeholder="Edad"
          value={useForm.age}
          onChange={handleChange}
        />
        <input
          name="power"
          placeholder="Poder"
          value={useForm.power}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
      </form>

      <h2>Unicornios Cargados</h2>
      <ul>
        {unicorns.map((u) => (
          <li key={u._id}>
            🦄 <strong>{u.name}</strong> - Color: {u.color}, Edad: {u.age}, Poder: {u.power}
            <button onClick={() => handleEdit(u)} style={{ marginLeft: '10px' }}>Editar</button>
            <button onClick={() => handleDelete(u._id)} style={{ marginLeft: '5px' }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

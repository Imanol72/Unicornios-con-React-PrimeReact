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

  const API_URL = 'https://crudcrud.com/api/c41bb1175c464f37bb0a7bd84e101f4e/unicorns';

  // Traer los unicornios existentes
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log('Unicornios existentes:', data);
        setUnicorns(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
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

  // Crear nuevo unicornio
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useForm),
      });

      const json = await res.json();
      console.log('Unicornio creado:', json);

      setUnicorns((prev) => [...prev, json]);
      localStorage.setItem('objectId', json._id);
      localStorage.setItem('objectName', json.name);

      // Resetear el formulario
      setUseForm({ name: '', color: '', age: 0, power: '' });
    } catch (err) {
      console.error('Error al crear unicornio:', err);
    }
  };

  return (
    <div className="App">
      <h1>Crear Unicornio</h1>
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
        <button type="submit">Agregar</button>
      </form>

      <h2>Unicornios Cargados</h2>
      <ul>
        {unicorns.map((u) => (
          <li key={u._id}>
            🦄 <strong>{u.name}</strong> - Color: {u.color}, Edad: {u.age}, Poder: {u.power}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

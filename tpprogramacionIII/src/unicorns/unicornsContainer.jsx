import { useEffect, useState } from 'react';
import UnicornsView from './unicornsViews.jsx';

const API_URL = 'https://crudcrud.com/api/c41bb1175c464f37bb0a7bd84e101f4e/unicorns';

function UnicornsContainer() {
  const [unicorns, setUnicorns] = useState([]);
  const [useForm, setUseForm] = useState({
    name: '',
    color: '',
    age: 0,
    power: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setUnicorns(data))
      .catch((error) => console.error('Error al traer los unicornios:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUseForm((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!useForm.name || !useForm.color || !useForm.power || useForm.age <= 0) {
      alert('Completá todos los campos correctamente.');
      return;
    }

    try {
      if (editingId) {
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

      setUseForm({ name: '', color: '', age: 0, power: '' });
    } catch (err) {
      console.error('Error al guardar unicornio:', err);
    }
  };

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
    <UnicornsView
      unicorns={unicorns}
      useForm={useForm}
      editingId={editingId}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
}

export default UnicornsContainer;

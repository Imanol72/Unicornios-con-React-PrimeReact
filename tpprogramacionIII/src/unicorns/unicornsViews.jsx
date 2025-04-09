function UnicornsView({
    unicorns,
    useForm,
    editingId,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
  }) {
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
  
  export default UnicornsView;
  
import styled from "styled-components";
import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { UsuarioService } from "../../services/UsuarioService";
import { DepartamentoService } from "../../services/DepartamentoService"; 
import { Delete, Edit } from '@mui/icons-material';
import { showToast } from "../../components/helpers";

const usuarioService = new UsuarioService();
const departamentoService = new DepartamentoService();

export function Usuarios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);
  const [departamentos, setDepartamentos] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: '',
    rolDeUsuario: '',
    contrasena: '',
    idEmpleado: '',
    departamentos: []
  });
  
  const [isEditing, setIsEditing] = useState(false); // Estado para verificar si estamos en modo de edición

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuarioResponse = await usuarioService.getAll();
        if (usuarioResponse.success) {
          setData(usuarioResponse.usuarios);
        } else {
          showToast('error', 'No se pudieron obtener los usuarios.', '#9c1010');
        }

        const departamentoResponse = await departamentoService.getAll();
        if (departamentoResponse.success) {
          setDepartamentos(departamentoResponse.departamentos); 
        } else {
          showToast('error', 'No se obtienen los departamentos.', '#9c1010');
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        showToast('error', 'Error al obtener datos.', '#9c1010');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleDepartamentoChange = (e) => {
    const { options } = e.target;
    const selectedDepartments = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setNuevoUsuario({ ...nuevoUsuario, departamentos: selectedDepartments });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const empleadoExists = data.some(user => user.idEmpleado === nuevoUsuario.idEmpleado);
    if (empleadoExists && !isEditing) {
      showToast('error', 'El ID de empleado ya está en uso.', '#9c1010');
      return; 
    }

    const usuario = {
      Usuario: nuevoUsuario.usuario,
      RolDeUsuario: nuevoUsuario.rolDeUsuario,
      Contrasena: nuevoUsuario.contrasena,
      IdEmpleado: nuevoUsuario.idEmpleado,
      FechaCreacion: new Date().toISOString().split('T')[0]
    };

    try {
      if (isEditing) {
        // Lógica para actualizar el usuario
        const result = await usuarioService.update(nuevoUsuario.usuario, usuario); 
        if (result.success) {
            showToast('success', 'Usuario actualizado', '#2d800e');
            setData(prevData => 
                prevData.map(user => (user.usuario === nuevoUsuario.usuario ? usuario : user)) 
            );
            setIsEditing(false); 
            setNuevoUsuario({ usuario: '', rolDeUsuario: '', contrasena: '', idEmpleado: '', departamentos: [] }); 
        } else {
            showToast('error', 'Error al actualizar el usuario: ' + result.status, '#9c1010');
        }
      } else {
        // Lógica para crear el usuario
        const result = await usuarioService.create(usuario);
        if (result.success) {
          showToast('success', 'Usuario creado', '#2d800e');
          setData(prevData => [...prevData, result.usuario]);
          setNuevoUsuario({ usuario: '', rolDeUsuario: '', contrasena: '', idEmpleado: '', departamentos: [] }); 
        } else {
          showToast('error', 'Error al crear el usuario: ' + result.status, '#9c1010');
        }
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      showToast('error', 'Error al agregar el usuario: ' + errorMessage, '#9c1010');
    }
  };

  const onRowUpdate = (newData) => {
    setNuevoUsuario({
      usuario: newData.usuario,
      rolDeUsuario: newData.rolDeUsuario,
      contrasena: newData.contrasena,
      idEmpleado: newData.idEmpleado,
      departamentos: newData.departamentos
    });
    setIsEditing(true); // Activa el modo de edición
  };

  const EDITABLE_COLUMNS = [
    { title: "Usuario", field: "usuario" }, 
    { title: "Rol de Usuario", field: "rolDeUsuario" },
    { title: "Contraseña", field: "contrasena" },
    { title: "Fecha de Creación", field: "fechaCreacion", type: "date" },
    { title: "Id Empleado", field: "idEmpleado" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1300) {
        setMaxBodyHeight(470);
      } else if (window.innerWidth < 2000) {
        setMaxBodyHeight(580);
      } else {
        setMaxBodyHeight(480);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h3>{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
        <input 
          type="text" 
          name="usuario" 
          placeholder="Nombre de Usuario" 
          value={nuevoUsuario.usuario} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="text" 
          name="rolDeUsuario" 
          placeholder="Rol de Usuario" 
          value={nuevoUsuario.rolDeUsuario} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="password" 
          name="contrasena" 
          placeholder="Contraseña" 
          value={nuevoUsuario.contrasena} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="text" 
          name="idEmpleado" 
          placeholder="ID Empleado" 
          value={nuevoUsuario.idEmpleado} 
          onChange={handleInputChange} 
          required 
        />
        <select multiple={true} value={nuevoUsuario.departamentos} onChange={handleDepartamentoChange} required>
          {departamentos.map(departamento => (
            <option key={departamento.departamento} value={departamento.departamento}>
              {departamento.departamento}
            </option>
          ))}
        </select>
        <button type="submit">{isEditing ? 'Actualizar Usuario' : 'Agregar Usuario'}</button>
      </Form>

      <MaterialTable
        key={data.length}
        size="small"
        title="Lista de Usuarios"
        columns={EDITABLE_COLUMNS}
        data={data}
        options={{
          actionsColumnIndex: -1,
          maxBodyHeight: maxBodyHeight,
          paging: false,
          headerStyle: {
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 9999,
          },
        }}
        icons={{
          Edit: () => <Edit style={{ fontSize: "18px" }} />,
          Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />,
        }}
        localization={{
          body: {
            editRow: {
              deleteText: "¿Estás seguro de que deseas eliminar este usuario?",
              cancelTooltip: "Cancelar",
              saveTooltip: "Confirmar",
            },
          },
          header: {
            actions: "Acciones",
          },
        }}
        editable={{
          onRowDelete: (oldData) => {
            console.log('Datos del usuario a eliminar:', oldData);
            return new Promise((resolve, reject) => {
              usuarioService.delete(oldData.usuario)  
                .then(response => {
                  if (response.success) {
                    showToast('success', 'Usuario eliminado con éxito', '#2d800e');
                    setData(prevData => 
                      prevData.filter(user => user.usuario !== oldData.usuario)  
                    );
                    resolve();
                  } else {
                    showToast('error', 'Error al eliminar el usuario', '#9c1010');
                    reject("Error al eliminar el usuario");
                  }
                })
                .catch(error => {
                  showToast('error', `Error: ${error.message}`, '#9c1010');
                  reject(`Error: ${error.message}`);
                });
            });
          },
        }}
        actions={[
          {
            icon: () => <Edit style={{ fontSize: "18px" }} />,
            tooltip: "Editar Usuario",
            onClick: (event, rowData) => onRowUpdate(rowData),
          },
        ]}
      />
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  input, select {
    margin: 10px 0;
    padding: 10px;
    font-size: 16px;
  }

  button {
    padding: 10px;
    background-color: #2d800e;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      background-color: #3c910e;
    }
  }
`;

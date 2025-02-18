import styled from "styled-components";
import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { UsuarioService } from "../../services/UsuarioService";
import { DepartamentoService } from "../../services/DepartamentoService"; 
import { DepUsuarioService } from '../../services/DepUsuarioService'; 
import { Delete, Edit } from '@mui/icons-material';
import { showToast } from "../../components/helpers";
import { Autocomplete, TextField } from "@mui/material";

const usuarioService = new UsuarioService();
const departamentoService = new DepartamentoService();
const depUsuarioService = new DepUsuarioService();

export function Usuarios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);
  const [departamentos, setDepartamentos] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: '',
    rolDeUsuario: '',
    contrasena: '',
    idEmpleado: ''
  });
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isEditing, setIsEditing] = useState(false); 
  
  const fetchUsuarios = async () => {  
    try {  
        const usuarioResponse = await usuarioService.getAll();  
        console.log("Respuesta de usuarios:", usuarioResponse);  
        if (usuarioResponse.success) {  
            setData(usuarioResponse.usuarios);  
        } else {  
            showToast('error', 'No se pudieron obtener los usuarios.', '#9c1010');  
        }  
    } catch (error) {  
        console.error("Error al obtener usuarios:", error);  
        showToast('error', 'Error al obtener usuarios.', '#9c1010');  
    }  
};  

const fetchDepartamentos = async () => {  
    try {  
        const departamentoResponse = await departamentoService.getAll();  
        console.log("Respuesta de departamentos:", departamentoResponse);  
        if (departamentoResponse.success) {  
            setDepartamentos(departamentoResponse.departamentos);   
        } else {  
            showToast('error', 'No se pudieron obtener los departamentos.', '#9c1010');  
        }  
    } catch (error) {  
        console.error("Error al obtener departamentos:", error);  
        showToast('error', 'Error al obtener departamentos.', '#9c1010');  
    }  
};  

const fetchData = async () => {  
    setLoading(true);  
    await fetchUsuarios(); 
    await fetchDepartamentos(); 
    setLoading(false);  
};  

useEffect(() => {  
    fetchData();  
}, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1300) setMaxBodyHeight(470);
      else if (window.innerWidth < 2000) setMaxBodyHeight(580);
      else setMaxBodyHeight(480);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const selectedDepartments = departamentos
      .filter(depto => depto.selected)
      .map(depto => depto.id || depto.someOtherField);
    setNuevoUsuario(prevState => ({ ...prevState, departamentos: selectedDepartments }));
  }, [departamentos]);


  const validateInput = (name, value) => {
    let errorMsg = "";

    if (!value.trim()) {
        errorMsg = "Este campo es obligatorio";
    } else {
        switch (name) {
            case "usuario":
                if (value.length < 3) errorMsg = "El usuario debe tener al menos 3 caracteres";
                if (value.length > 20) errorMsg = "El usuario no puede tener más de 20 caracteres";
                break;
            case "contrasena":
                if (value.length < 6) errorMsg = "La contraseña debe tener al menos 6 caracteres";
                if (value.length > 50) errorMsg = "La contraseña no puede tener más de 50 caracteres";
                break;
            case "idEmpleado":
                if (value.length > 20) errorMsg = "El ID de empleado no puede tener más de 20 caracteres";
                if (!/^[a-zA-Z0-9]+$/.test(value)) errorMsg = "El ID de empleado debe ser alfanumérico";
                break;
            default:
                break;
        }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value.trimStart() });
    validateInput(name, value);
  }; 

const handleDepartmentChange = (event, newValue) => {  
  setSelectedDepartments(newValue); 
}; 

  const handleCancel = () => {
    setIsEditing(false);
    setNuevoUsuario({ usuario: '', rolDeUsuario: '', contrasena: '', idEmpleado: '', departamentos: [] });
    setSelectedDepartments([]);
  };

  const onRowUpdate = async (newData) => {  
    try {  
        const depResponse = await depUsuarioService.getByUsuario(newData.usuario);  
        if (depResponse.success) {  
            const deptosSeleccionados = departamentos.filter(depto =>  
                depResponse.departamentos.some(d => d.departamento.trim().toLowerCase() === depto.departamento.trim().toLowerCase())  
            );  
            setSelectedDepartments(deptosSeleccionados.map(depto => depto.departamento));
            setNuevoUsuario({ ...newData, departamentos: deptosSeleccionados.map(depto => depto.departamento) });  
        } else {  
            setSelectedDepartments([]);  
            setNuevoUsuario(newData);  
        }  
        setIsEditing(true);
    } catch (error) {  
        showToast("error", "Error al obtener los departamentos del usuario.", "#9c1010");  
    }  
  };

  useEffect(() => {
    if (isEditing && nuevoUsuario.usuario) {

      depUsuarioService.getByUsuario(nuevoUsuario.usuario)
        .then(response => {
          if (response.success) {
            setSelectedDepartments(response.departamentos);
          } else {
            showToast('error', 'No se pudieron obtener los departamentos del usuario.', '#9c1010');
          }
        })
        .catch(error => {
          showToast('error', 'Error al obtener departamentos del usuario.', '#9c1010');
        });
    }
  }, [isEditing, nuevoUsuario.usuario]);
  

  const handleSubmit = async (e) => {  
    e.preventDefault();

    const newErrors = {};
    Object.keys(nuevoUsuario).forEach((key) => {
      if (typeof nuevoUsuario[key] === "string") {
        nuevoUsuario[key] = nuevoUsuario[key].trim();
      }
    });
    
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Por favor completa todos los campos correctamente.', '#9c1010');
      return;
    }

    if (!nuevoUsuario.usuario.trim() || !nuevoUsuario.rolDeUsuario.trim() || 
    !nuevoUsuario.contrasena.trim() || !nuevoUsuario.idEmpleado.trim()) {
    showToast('error', 'Todos los campos son obligatorios y no pueden contener solo espacios.', '#9c1010');  
    return;
}

    const empleadoExists = data.some(user => user.idEmpleado === nuevoUsuario.idEmpleado);  
    if (empleadoExists && !isEditing) {  
        showToast('error', 'El ID de empleado ya está en uso.', '#9c1010');  
        return;  
    }

    try {  
      const usuarioData = {  
          Usuario: nuevoUsuario.usuario,  
          RolDeUsuario: nuevoUsuario.rolDeUsuario,  
          Contrasena: nuevoUsuario.contrasena,  
          IdEmpleado: nuevoUsuario.idEmpleado,  
          FechaCreacion: isEditing ? undefined : new Date().toISOString().split('T')[0],  
      };  

      const departamentosNuevos = selectedDepartments.map(depto => depto.nombre || depto.departamento);

      const result = isEditing ? 
        await usuarioService.update(nuevoUsuario.usuario, usuarioData) :
        await usuarioService.create(usuarioData);

      if (result.success) {  
        const depResult = isEditing ? 
          await depUsuarioService.update(nuevoUsuario.usuario, departamentosNuevos) : 
          await depUsuarioService.store(nuevoUsuario.usuario, departamentosNuevos);
          
        if (depResult.success) {
          showToast('success', isEditing ? 'Usuario actualizado' : 'Usuario creado', '#2d800e');
          await fetchData();
        } else {
          throw new Error('Error al actualizar los departamentos.');
        }
      } else {
        throw new Error(isEditing ? 'Error al actualizar el usuario.' : 'Error al crear el usuario.');
      }
    } catch (error) {  
      showToast('error', 'Se produjo un error: ' + error.message, '#9c1010');  
      console.error('Error en handleSubmit:', error);  
    }  
    handleCancel();
  };



  const getColumns = () => {  
    return [  
      { title: "Usuario", field: "usuario" },  
      { title: "Rol de Usuario", field: "rolDeUsuario" },  
      { title: "Contraseña", field: "contrasena" },  
      { title: "Fecha de Creación", field: "fechaCreacion", type: "date" },  
      { title: "Id Empleado", field: "idEmpleado" },  
    ];  
  };  

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
    <h3>{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
    
    <TextField 
      label="Nombre de Usuario"
      name="usuario"
      value={nuevoUsuario.usuario}
      onChange={handleInputChange}
      error={!!errors.usuario}
      helperText={errors.usuario}
      required
    />

    <TextField 
      select
      name="rolDeUsuario"
      value={nuevoUsuario.rolDeUsuario}
      onChange={handleInputChange}
      error={!!errors.rolDeUsuario}
      helperText={errors.rolDeUsuario}
      SelectProps={{ native: true }}
      required
    >
      <option value="" disabled>Seleccione un rol</option>
      <option value="ADMIN">ADMIN</option>
      <option value="GENERAL">GENERAL</option>
    </TextField>

    <TextField 
      label="Contraseña"
      type="password"
      name="contrasena"
      value={nuevoUsuario.contrasena}
      onChange={handleInputChange}
      error={!!errors.contrasena}
      helperText={errors.contrasena}
      required
    />

    <TextField 
      label="ID Empleado"
      name="idEmpleado"
      value={nuevoUsuario.idEmpleado}
      onChange={handleInputChange}
      error={!!errors.idEmpleado}
      helperText={errors.idEmpleado}
      required
    />

    <Autocomplete
      multiple
      options={departamentos}
      getOptionLabel={(option) => option.departamento}
      value={selectedDepartments}
      onChange={handleDepartmentChange}
      renderInput={(params) => (
        <TextField 
          {...params} 
          variant="outlined" 
          label="Departamentos" 
          error={!!errors.departamentos}
          helperText={errors.departamentos}
          
        />
      )}
    />

    <ButtonContainer>
      <button type="submit">{isEditing ? 'Actualizar Usuario' : 'Agregar Usuario'}</button>
      {isEditing && <button type="button" onClick={handleCancel} className="cancel-button">Cancelar</button>}
    </ButtonContainer>
  </Form>

      <MaterialTable
        size="small"  
        title="Lista de Usuarios"  
        columns={getColumns()}
        data={data} 
        options={{
          actionsColumnIndex: -1,
          maxBodyHeight,
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
            emptyDataSourceMessage: 'No se encontraron usuarios',
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
          onRowDelete: async (oldData) => {  
            try {  
              const rowIndex = data.findIndex(user => user.usuario === oldData.usuario); // Hallar el índice de la fila  
              const response = await usuarioService.delete(oldData.usuario);  
              if (response.success) {  
                showToast('success', 'Usuario eliminado con éxito', '#2d800e');  
                setData(prevData => prevData.filter((user, index) => index !== rowIndex)); // Eliminar usando índice  
              } else {  
                throw new Error('Error al eliminar el usuario');  
              }  
            } catch (error) {  
              showToast('error', `Error: ${error.message}`, '#9c1010');  
            }  
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between; 
  margin-top: 10px; 
`;

const Form = styled.form`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  width: 50%;
  
  input, select {
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    margin: 5px 5px; 
    padding: 5px 10px;
    background-color: #4CAF50; 
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #45a049;
    }
  }

  .cancel-button {
    background-color: red; 
    &:hover {
      background-color: darkred; 
    }
  }
`;

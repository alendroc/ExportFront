import styled from "styled-components";
import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { UsuarioService } from "../../services/UsuarioService";
import { DepartamentoService } from "../../services/DepartamentoService"; 
import { Delete, Edit } from '@mui/icons-material';

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

  useEffect(() => {
    usuarioService.getAll()
      .then((response) => {
        if (response.success) {
          setData(response.usuarios);
          console.log("Usuarios:", response.usuarios);
        } else {
          console.log("No se pudieron obtener los usuarios.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
      });
      
        departamentoService.getAll() 
          .then(response => {
            if (response.isSuccess) {
              setDepartamentos(response.departamentos); 
            } else {
              console.log("No se pudieron obtener los departamentos:", response.message); // Incluye el mensaje de error
            }
          })
          .catch(error => {
            console.error("Error al obtener los departamentos:", error);
          });
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

    const usuario = {
        Usuario: nuevoUsuario.usuario,
        RolDeUsuario: nuevoUsuario.rolDeUsuario,
        Contrasena: nuevoUsuario.contrasena,
        IdEmpleado: nuevoUsuario.idEmpleado,
        Departamentos: nuevoUsuario.departamentos, 
        FechaCreacion: new Date().toISOString().split('T')[0] // Asignar la fecha actual
    };
    console.log('Datos del usuario:', usuario);
    try {
        const result = await usuarioService.create(usuario);
        if (result.success) {
            console.log("Usuario creado con éxito:", result.usuario);
            setData(prevData => [...prevData, result.usuario]);
        } else {
            console.error("Error al crear el usuario:", result.status);
        }
    } catch (error) {
        console.error("Error al agregar el usuario:", error.message);
    }
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
        <h3>Agregar Usuario</h3>
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
        <button type="submit">Agregar Usuario</button>
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
          onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
              usuarioService.update(oldData.idUsuario, newData)
                .then(response => {
                  if (response.isSuccess) {
                    setData(prevData => 
                      prevData.map(user => (user.idUsuario === oldData.idUsuario ? newData : user))
                    );
                    resolve();
                  } else {
                    reject("Error al actualizar el usuario");
                  }
                })
                .catch(error => {
                  reject(`Error: ${error.message}`);
                });
            });
          },
          onRowDelete: (oldData) => {
            console.log('Datos del usuario a eliminar:', oldData);
            return new Promise((resolve, reject) => {
              usuarioService.delete(oldData.usuario)  
                .then(response => {
                  if (response.success) {
                    setData(prevData => 
                      prevData.filter(user => user.usuario !== oldData.usuario)  
                    );
                    resolve();
                  } else {
                    reject("Error al eliminar el usuario");
                  }
                })
                .catch(error => {
                  reject(`Error: ${error.message}`);
                });
            });
          },
          
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  display: block;
  width: 90%;
  max-width: 1800px;

  .MuiToolbar-root {
    background-color: #060270;
    color: white;
  }

  .MuiTableCell-root {
    border-radius: 20px;
    padding: 4px 8px;
    font-size: 12px !important;
  }

  .MuiTableRow-root {
    height: 30px;
  }

  .MuiTypography-h6 {
    font-size: 16px;
  }

  @media (min-width: 1600px) {
    .MuiTypography-h6 {
      font-size: 20px;
    }
    .MuiTableCell-root {
      padding: 0 8px;
      font-size: 16px !important;
    }
  }
`;

const Form = styled.form`
  display: block;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f2f2f2;
  border-radius: 8px;

  input, select {
    display: block;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  button {
    padding: 0.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #0056b3;
    }
  }
`;

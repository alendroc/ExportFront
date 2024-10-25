import styled from "styled-components";
import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { UsuarioService } from "../../services/UsuarioService";
import { Delete, Edit } from '@mui/icons-material'; 

var usuarioService = new UsuarioService();

export function Usuarios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);

  useEffect(() => {
    usuarioService.getAll()
      .then((response) => {
        if (response.isSuccess) {
          setData(response.usuarios);
          console.log("Usuarios", response.usuarios);
        } else {
          console.log("No se pudieron obtener los usuarios.");
          console.error("Error al obtener los usuarios:", error);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
      });
  }, []);

  const EDITABLE_COLUMNS = [
    { title: "Id", field: "idUsuario" }, 
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
                    setData(prevData => prevData.map(user => user.idUsuario === oldData.idUsuario ? newData : user));
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
            return new Promise((resolve, reject) => {
              usuarioService.delete(oldData.idUsuario)  
                .then(response => {
                  if (response.isSuccess) {
                    setData(prevData => prevData.filter(user => user.idUsuario !== oldData.idUsuario));
                    resolve();
                  } else {
                    reject("Error al eliminar el usuario");
                  }
                })
                .catch(error => {
                  reject(error.message);
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

import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, { useState, useEffect  } from "react";
import { Delete, Edit, AddBox } from '@mui/icons-material';
import { TemporadasService } from "../../services/TemporadasService";

var temporadasService = new TemporadasService

  const columns = [
    { title: "Temporada", field: "temporada", },
    { title: "Actual", field: "actual", type: "boolean",  },
    { title: "Descripción", field: "descripcion", },
    { title: "Fecha Inicio", field: "fechaInicio", type: "date",},
    { title: "Fecha Fin", field: "fechaFin", type: "date", },
];

export function Temporada() {
const [data, setData] = useState([]);
const [maxBodyHeight, setMaxBodyHeight] = useState(480);

useEffect(() => {
    temporadasService.getAll()
        .then((response) => {
            if (response.success) {
                setData(response.temporadas); // Aquí cambié 'temporada' a 'temporadas'
                console.log("Temporadas", response.temporadas);
            } else {
                console.log("No se pudieron obtener las temporadas.");
            }
        })
        .catch(error => {
            console.error("Error al obtener las temporadas:", error);
        });
}, []);
   

// Detecta el tamaño de la pantalla para ajustar la altura máxima del cuerpo
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 1300) {
      setMaxBodyHeight(470); // Para pantallas pequeñas (menos de 768px)
    } else if (window.innerWidth < 2000) {
      setMaxBodyHeight(580); // Para pantallas medianas (menos de 1200px)
    } else {
      setMaxBodyHeight(480); // Pantallas grandes
    }
  };
  // Ejecuta la función de redimensionamiento al cargar el componente
  handleResize();
  // Agrega un listener para manejar el cambio de tamaño de la pantalla
  window.addEventListener("resize", handleResize);
  // Limpia el listener cuando el componente se desmonta
  return () => window.removeEventListener("resize", handleResize);
}, []);

    return (
    <Container >
       <MaterialTable size="small"
       title="Gestión de Temporadas"
      data={data}
      columns={columns}
    
      options={{
        actionsColumnIndex: -1,
        maxBodyHeight: maxBodyHeight, 
        padding: onabort,
        paging: false, 
        headerStyle: {
            position: 'sticky', 
            top: 0, // Hace que el encabezado de la tabla sea fijo
            backgroundColor: '#fff',
            zIndex: 9999,
          },
      }}
      icons={{
        Add: () => <AddBox style={{ fontSize: "25px", color: "white" }} />, // Cambia el tamaño del ícono de agregar
        Edit: () => <Edit style={{ fontSize: "18px" }} />, // Cambia el tamaño del ícono de editar
        Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />, // Cambia el tamaño y color del ícono de eliminar
      }}
      localization={{
        body: {
          editRow: {
            deleteText: '¿Estás seguro de que deseas eliminar esta temporada?', // Cambia el mensaje de confirmación
            cancelTooltip: 'Cancelar', // Texto del botón de cancelar
            saveTooltip: 'Confirmar',  // Texto del botón de confirmar
          },
        },
        header: {
          actions: 'Acciones' // Cambia el encabezado de la columna de acciones
        }
      }}
      editable={{
        onRowAddCancelled: (rowData) => console.log("Row adding cancelled"),
        onRowUpdateCancelled: (rowData) => console.log("Row editing cancelled"),
        onRowAdd: (newData) => {
            return new Promise((resolve, reject) => {
              const { temporada, actual, descripcion, fechaInicio, fechaFinal } = newData;
              const nuevaTemporada = { temporada, actual, descripcion, fechaInicio, fechaFinal }; // Asegúrate de que este sea el formato correcto
          
              temporadasService.create(nuevaTemporada).then(response => {
               
                if (response.success) {
                  // Si la creación fue exitosa, actualiza el estado
                  setData([...data, response.temporadas]); // Asegúrate de usar response.temporadas según lo que retorne tu API
                  resolve();
                } else {
                  reject("Error al crear la temporada.");
                }
              })
              .catch(error => {
                console.error("Error al agregar la temporada:", error);
                reject(error.message || "Error inesperado.");
              });
            });
          },
        onRowUpdate: (newData, oldData) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...data];
              // In dataUpdate, find target
              const target = dataUpdate.find((el) => el.temporada === oldData.temporada);
              const index = dataUpdate.indexOf(target);
              dataUpdate[index] = newData;
              setData(dataUpdate);
              resolve();
            }, 1000);
          });
        },
        onRowDelete: (oldData) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = data.filter((el) => el.temporada !== oldData.temporada);
              setData(dataDelete);
              resolve();
            }, 1000);
          });
        },
      }}
    />
    </Container>
    
    );
  }
  const Container =styled.div`
   display: block;
   width: 90%;
   max-width: 1100px;

        .MuiToolbar-root {
         background-color: #4caf50; /* Cambia el color del fondo del toolbar */
         color: white; /* Cambia el color del texto del toolbar */
         }


     .MuiTableCell-root {
        border-radius: 20px;
        padding: 4px 8px; 
        font-size: 12px !important;
      }
    
      .MuiTableRow-root {
        height: 30px; /* Cambia la altura de las filas */
      }
      .MuiTypography-h6 {
    font-size: 16px; /* Cambia este valor al tamaño deseado */
     }
     @media (max-width: 1200px){
       
     }
    
     @media (min-width: 1600px) {
    .MuiTypography-h6 {
      font-size: 20px; /* Tamaño de fuente para el título en pantallas grandes */
      
    }
    .MuiTableCell-root {
        padding: 0 8px; 
        font-size: 16px !important;
      }
    }
  `
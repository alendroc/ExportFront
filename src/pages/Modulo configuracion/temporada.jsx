import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, { useState, useEffect  } from "react";
import { Delete, Edit, AddBox } from '@mui/icons-material';
import { TemporadasService } from "../../services/TemporadasService";
import { showToast } from "../../components/helpers";

var temporadasService = new TemporadasService

  const columns = [
    { title: "Temporada", field: "temporada", editable: 'onAdd', validate: row => {
        if (!row || typeof row.temporada === 'undefined') {
            return {
                isValid: false,
                helperText: "El campo temporada no puede estar vacío"
            };}
        if (row.temporada.trim() === "") {
            return {
                isValid: false,
                helperText: "El campo temporada no puede estar vacío"
            };}
        const yearFormat = /^(\d{4})-(\d{4})$/;
        const match = row.temporada.match(yearFormat);
        if (!match) {
            return {
                isValid: false,
                helperText: "El formato debe ser '2002-2003'"
            };}
        const startYear = parseInt(match[1]);
        const endYear = parseInt(match[2]);
        if (startYear >= endYear) {
            return {
                isValid: false,
                helperText: "El primer año debe ser menor que el segundo"};}
        return { isValid: true };}
},
    { title: "Actual", field: "actual", type: "boolean",  },
    { title: "Descripción", field: "descripcion", },
    { title: "Fecha Inicio", field: "fechaInicio", type: "date",  editComponent: props => (
      <input
        type="date"
        value={props.value || ''} // Para manejar el valor actual del input
        onChange={e => props.onChange(e.target.value)}
        style={{     // Ancho del input
        padding: '8px',      // Espaciado interno
        border: '1px solid #ccc',  // Borde gris claro
        borderRadius: '4px', // Bordes redondeados
        fontSize: '14px',    // Tamaño del texto
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',  // Sombra ligera para darle profundidad
        outline: 'none',     // Eliminar el borde azul por defecto al hacer clic
        margin: '5px 0',  }} // Ajusta el ancho del input aquí
      />) },
    { title: "Fecha Final", field: "fechaFin", type: "date",   
    editComponent: props => (
      <input
        type="date"
        value={props.value || ''} // Para manejar el valor actual del input
        onChange={e => props.onChange(e.target.value)}
        style={{     // Ancho del input
        padding: '8px',      // Espaciado interno
        border: '1px solid #ccc',  // Borde gris claro
        borderRadius: '4px', // Bordes redondeados
        fontSize: '14px',    // Tamaño del texto
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',  // Sombra ligera para darle profundidad
        outline: 'none',     // Eliminar el borde azul por defecto al hacer clic
        margin: '5px 0',  }} // Ajusta el ancho del input aquí
      />) },
] || [];

export function Temporada() {
const [data, setData] = useState([]);
const [maxBodyHeight, setMaxBodyHeight] = useState(480);

useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await temporadasService.getAll();
            if (response.success) {
                setData(response.temporadas); 
                console.log("Temporadas", response.temporadas);
            } else {
                console.log("No se pudieron obtener las temporadas.");
            }
        } catch (error) {
            console.error("Error al obtener las temporadas:", error);
        }
    };
    fetchData();
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
      columns={columns || []}
      options={{
        actionsColumnIndex: -1,
        maxBodyHeight: maxBodyHeight, 
        padding: onabort,
        paging: false, 
        headerStyle: {
            position: 'sticky', 
            top: 0,
            zIndex: 1,
            backgroundColor: '#fff',
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
          editTooltip: 'Editar',  
          deleteTooltip: 'Eliminar',
          addTooltip: 'Agregar'
        },
        header: {
          actions: 'Acciones' // Cambia el encabezado de la columna de acciones
        },
        toolbar: {
          searchTooltip: 'Buscar',
          searchPlaceholder: 'Buscar', // Cambia el texto del placeholder de búsqueda aquí
      },
      }}
      editable={{
        onRowAddCancelled: (rowData) => console.log("Row adding cancelled"),
        onRowUpdateCancelled: (rowData) => console.log("Row editing cancelled"),
        onRowAdd: (newData) => {
            return new Promise((resolve, reject) => { 
                const newDataWithId = {
                    ...newData,
                    temporada: newData.temporada,
                    activacion: newData.activacion !== undefined ? newData.activacion : false,
                    descripcion: newData.descripcion && newData.descripcion.trim() !== "" ? newData.descripcion.toUpperCase() : null,
                }; 
          

            if (newDataWithId.fechaInicio == null || newDataWithId.fechaFin == null) {
                  showToast('error', 'Debe completar los campos fecha', '#9c1010');
                  reject('Error al actualizar el producto: Fecha inválida');
                  return;
              }     
           if (newDataWithId.fechaInicio >= newDataWithId.fechaFin) {
               showToast('error', 'La fecha inicio debe ser menor a fecha final','#9c1010'); 
               reject(`Error al crear el producto: ${response.message}`);
              }else{
                const response = temporadasService.getAll();
            if (response.success) {
                setData(response.temporadas); 
                console.log("Temporadas", response.temporadas);
            } else {
                console.log("No se pudieron obtener las temporadas.");
            }
                  const isDuplicate = data.some(season => season.temporada === newDataWithId.temporada)


                  console.log(data)
                  if(isDuplicate){
                    
                    showToast('error', 'Ya existe esa temporada','#9c1010'); 
                    reject(`Error al crear el producto: ${response.message}`);
                  }else{
                    temporadasService.create(newDataWithId)
                        .then(response => {
                            if (response.success) {
                                console.log("Temporada creada exitosamente");
                                setData(prevData => [...prevData, newDataWithId]);
                                showToast('success', 'Temporada creada', '#2d800e');
                                resolve();
                            } else {
                                reject(`Error al crear el producto: ${response.message}`);
                            }
                        })
                        .catch(error => {
                            reject(`Error de red: ${error.message}`);
                        });
                      }
                }
          });
        },
        onRowUpdate: (newData, oldData) => {
          return new Promise((resolve, reject) => {
              const index = data.findIndex(item => item.temporada === oldData.temporada);
              const updatedData = [...data];
              const newDataWithId = {
                ...newData,
                temporada: newData.temporada,
                activacion: newData.activacion !== undefined ? newData.activacion : false,
                descripcion: newData.descripcion && newData.descripcion.trim() !== "" ? newData.descripcion.toUpperCase() : null,
            }; 
            console.log(newDataWithId)

            if (newDataWithId.fechaInicio == "" || newDataWithId.fechaFin == "" || newDataWithId.fechaInicio == null ||  newDataWithId.fechaFin == null) {
                showToast('error', 'Debe completar los campos fecha', '#9c1010');
                reject('Error al actualizar el producto: Fecha inválida');
                return;
            }
              if (newDataWithId.fechaInicio >= newDataWithId.fechaFin) {
                  showToast('error', 'La fecha inicio debe ser menor a fecha final', '#9c1010');
                  reject('Error al actualizar el producto: Fecha inválida');
                  return;
              }
             

              const isDuplicate = updatedData.some((season, idx) => season.temporada === newDataWithId.temporada && idx !== index);
              if (isDuplicate) {
                  showToast('error', 'Ya existe esa temporada', '#9c1010');
                  reject('Error al actualizar el producto: La temporada ya existe');
                  return;
              }

              updatedData[index] = newDataWithId;

              temporadasService.update(oldData.temporada, newDataWithId) // Asumiendo que `oldData` tiene un campo `id`
                  .then(response => {
                      if (response.success) {
                          setData(updatedData);
                          showToast('success', 'Temporada actualizada', '#2d800e');
                          resolve();
                      } else {
                          reject(`Error al actualizar la temporada: ${response.message}`);
                          showToast('error', 'Error al actualizar la temporada', '#9c1010');
                      }
                  })
                  .catch(error => {
                      reject(`Error de red: ${error.message}`);
                  });
          });
        },
        onRowDelete: (oldData) => {
            return new Promise((resolve, reject) => {
                temporadasService.delete(oldData.temporada) // Llama a la función de eliminación
                .then(response => {
                    if (response.success) {
                        const dataDelete = data.filter((el) => el.temporada !== oldData.temporada);
                        setData(dataDelete);
                        showToast('success', 'Temporada eliminada', '#2d800e');
                        resolve();
                    } else {
                        reject('No se pudo eliminar la temporada.');
                    }
                })
                .catch(error => {
                    reject(`Error al eliminar: ${error.message}`);
                });
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
   z-index: 1;
        .MuiToolbar-root {
         background-color: #50ad53; /* Cambia el color del fondo del toolbar */
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
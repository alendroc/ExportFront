import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, { useState, useEffect  } from "react";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import { LoteService } from "../../services/LoteService";
import { showToast } from "../../components/helpers";

var loteService = new LoteService;


const columns = [
    { title: "Lote", field: "nombreLote", editable: 'onAdd', validate: (row) => {
      if((row.nombreLote || "").length === 0){return false}
      if(row.nombreLote?.length > 20){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 20 carácteres"
      };}
    }},
    { title: "Activo", field: "activo", type: "boolean" },
    { title: "Área", field: "area", type: "numeric", 
        validate: rowData => {
            const isDecimal = /^\d*\.?\d+$/.test(rowData.area);
            return rowData.area && isDecimal  ? true : { isValid: false, helperText: "numeros decimales ejemplo: 12,4" };
        }
    },
    { title: "Descripción", field: "descripcion",validate: (row) =>{
      if(row.descripcion?.length > 500){
       return {
         isValid: false,
         helperText: "El límite de la columna es de 500 carácteres"
     };}
   } },
];


export function Lote(){
    const [data, setData] = useState([]);
    const [maxBodyHeight, setMaxBodyHeight] = useState(480);
    //Agregar
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await loteService.getAll();
                if (response.success) {
                    setData(response.lotes); 
                    console.log("Lotes", response.lotes);
                } else {
                    console.log("No se pudieron obtener los lotes.");
                }
            } catch (error) {
                console.error("Error al obtener los lotes:", error);
            }
        };
        fetchData();
    }, []);

    // Detecta el tamaño de la pantalla para ajustar la altura máxima del cuerpo
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




  return(
<Container >
  <MaterialTable size="small"
       title="Gestión de lotes"
      data={data}
      columns={columns || []}
      options={{
        actionsColumnIndex: -1,
        addRowPosition: "first",
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
          emptyDataSourceMessage: 'No se encontraron lotes',
          editRow: {
            deleteText: '¿Estás seguro de que deseas eliminar este lote?', // Cambia el mensaje de confirmación
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
                nombreLote: newData.nombreLote.toUpperCase(),
                descripcion: newData.descripcion && newData.descripcion.trim() !== "" ? newData.descripcion.toUpperCase() : null,
            }
            const isDuplicate = data.some(lotes => lotes.nombreLote === newDataWithId.nombreLote)
            console.log(newDataWithId.nombreLote)
            if(isDuplicate){
              showToast('error', 'Ya existe ese lote','#9c1010'); 
              reject(`Error al crear el lote: ${response.message}`);
              return
            }
            
                    loteService.create(newDataWithId)
                        .then(response => {
                            if (response.success) {
                                console.log("Lote creado exitosamente");
                                setData(prevData => [ newDataWithId , ...prevData]);
                                showToast('success', 'Lote creado', '#2d800e');
                                resolve(); // Resolvemos la promesa si todo fue bien
                            } else {
                                reject(`Error al crear el lote: ${response.message}`);
                            }
                        })
                        .catch(error => {
                            reject(`Error de red: ${error.message}`);
                        });
              });
            
        },
        onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
            const index = data.findIndex(item => item.nombreLote === oldData.nombreLote);
            const updatedData = [...data];

            const newDataWithId = {
              ...newData,
              descripcion: newData.descripcion && newData.descripcion.trim() !== "" ? newData.descripcion.toUpperCase() : null,
          }

            const isDuplicate = updatedData.some((season, idx) => season.nombreLote === newDataWithId.nombreLote && idx !== index);
            if (isDuplicate) {
                showToast('error', 'Ya existe ese lote', '#9c1010');
                reject('Error al actualizar el lote: La temporada ya existe');
                return;
            }

            updatedData[index] = newDataWithId;

            loteService.update(oldData.nombreLote, newDataWithId) // Asumiendo que `oldData` tiene un campo `id`
                  .then(response => {
                      if (response.success) {
                          setData(updatedData);
                          showToast('success', 'Lote actualizado', '#2d800e');
                          resolve();
                      } else {
                          reject(`Error al actualizar el lote: ${response.message}`);
                          showToast('error', '`Error al actualizar el lote', '#9c1010');
                      }
                  })
                  .catch(error => {
                      reject(`Error de red: ${error.message}`);
                  });
            })

        },
        onRowDelete: (oldData) => { 
            return new Promise((resolve, reject) => {
                loteService.delete(oldData.nombreLote) // Llama a la función de eliminación
                .then(response => {
                    if (response.success) {
                        const dataDelete = data.filter((el) => el.nombreLote !== oldData.nombreLote);
                        setData(dataDelete);
                        showToast('success', 'Lote eliminado', '#2d800e');
                        resolve();
                    } else {
                        reject('No se pudo eliminar el lote.');
                    }
                })
                .catch(error => {
                  showToast('error', error, '#9c1010')
                  resolve()
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
width: 95%;

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
    max-width: 1100px;
 .MuiTypography-h6 {
   font-size: 20px; /* Tamaño de fuente para el título en pantallas grandes */
 }
 .MuiTableCell-root {
     padding: 0 8px; 
     font-size: 16px !important;
   }
 }
`

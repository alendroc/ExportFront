import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, {useState, useEffect  } from "react";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import { showToast } from "../../components/helpers";
import { VariedadesService } from "../../services/variedadesService";
var variedadesService = new VariedadesService;

const columns = [
    { title: "Cultivo", field: "cultivo", editable: 'onAdd',validate: (row) => (row.cultivo || "").length !== 0, 
    lookup: {
        MELON: 'MELÓN',
        CANA: 'CANA',
        // Agrega más opciones aquí, cada clave es el valor guardado y el valor de la clave es el texto mostrado
    }, },
    { title: "Variedad", field: "variedad",  editable: 'onAdd', validate: (row) => (row.variedad || "").length !== 0 },
    { title: "Abreviatura",  field: "nombreAbreviatura"},
    { title: "Descripción", field: "descripcion" },
];

export function Variedades() {
    const [data, setData] = useState([]);
    const [maxBodyHeight, setMaxBodyHeight] = useState(480);
    //Agregar
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await variedadesService.getAll();
                if (response.success) {
                    setData(response.variedades); 
                    console.log("variedades", response.variedades);
                } else {
                    console.log("No se pudieron obtener las variedades.");
                }
            } catch (error) {
                console.error("Error al obtener las variedades:", error);
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

    return (
<Container >
  <MaterialTable size="small"
       title="Gestión de variedades"
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
          emptyDataSourceMessage: 'No se encontraron variedades',
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
                console.log(newData)
              const newDataWithId = {
                ...newData,
                cultivo: newData.cultivo.toUpperCase(),
                variedad: newData.variedad.toUpperCase(),
                nombreAbreviatura: newData.nombreAbreviatura ? newData.nombreAbreviatura.toUpperCase() : "",
                descripcion: newData.descripcion ? newData.descripcion.toUpperCase() : "",
              }
            
              const isDuplicate = data.some(variante => 
                variante.cultivo.toUpperCase() === newDataWithId.cultivo &&
                variante.variedad.toUpperCase() === newDataWithId.variedad
             ); 

              if(isDuplicate){
                showToast('error', 'Ya existe esa variedad con ese cultivo','#9c1010'); 
                reject(`Error al crear la variedad: ${response.message}`);
                return
              }
              variedadesService.create(newDataWithId)
              .then(response => {
                  if (response.success) {
                      console.log("Variedad creada exitosamente");
                      setData(prevData => [...prevData, newDataWithId]);
                      showToast('success', 'Variedad creada', '#2d800e');
                      resolve(); // Resolvemos la promesa si todo fue bien
                  } else {
                      reject(`Error al crear la variedad: ${response.message}`);
                  }
              })
              .catch(error => {
                  reject(`Error de red: ${error.message}`);
              });

        })
        },
        onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
                const index = data.findIndex(item => item.variedad === oldData.variedad);
                const updatedData = [...data];

                const newDataWithId = {
                    ...newData,
                    cultivo: newData.cultivo.toUpperCase(),
                    variedad: newData.variedad.toUpperCase(),
                    nombreAbreviatura: newData.nombreAbreviatura ? newData.nombreAbreviatura.toUpperCase() : "",
                    descripcion: newData.descripcion ? newData.descripcion.toUpperCase() : "",
                  }
                  
                  const isDuplicate = data.some((variante , idx) => 
                    variante.cultivo.toUpperCase() === newDataWithId.cultivo &&
                    variante.variedad.toUpperCase() === newDataWithId.variedad
                    && idx !== index
                );
                 console.log(newDataWithId)
                if(isDuplicate){
                    showToast('error', 'Ya existe esa variedad con ese cultivo','#9c1010'); 
                    reject(`Error al crear la variedad: ${response.message}`);
                    return
                  }
                  updatedData[index] = newDataWithId;

                  variedadesService.update(oldData.cultivo, oldData.variedad, newDataWithId) // Asumiendo que `oldData` tiene un campo `id`
                  .then(response => {
                      if (response.success) {
                          setData(updatedData);
                          showToast('success', 'variedad actualizada', '#2d800e');
                          resolve();
                      } else {
                          reject(`Error al actualizar el articulo: ${response.message}`);
                          showToast('error', '`Error al actualizar la variedad', '#9c1010');
                      }
                  })
                  .catch(error => {
                      reject(`Error de red: ${error.message}`);
                  });

            })

        },
        onRowDelete: (oldData) => { 
          return new Promise((resolve, reject) => {
            variedadesService.delete(oldData.cultivo, oldData.variedad) // Llama a la función de eliminación
            .then(response => {
                if (response.success) {
                  const dataDelete = data.filter(
                    (el) => !(el.cultivo === oldData.cultivo && el.variedad === oldData.variedad)
                );
                    setData(dataDelete); 
                    showToast('success', 'variedad eliminada', '#2d800e');
                    resolve();
                } else {
                 
                  showToast('error', '`Error al elimanr el articulo', '#9c1010');
                    reject('No se pudo eliminar el articulo.');
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
  width: 100%;
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
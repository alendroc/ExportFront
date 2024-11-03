import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, { useState, useEffect } from "react";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import { showToast } from "../../components/helpers";
import { LaboresService } from "../../services/LaboresService";
import { Departamento } from "./departamentos";
var laboresService = new LaboresService;

const columns = [
  /*
  {
    title: "Cultivo", field: "cultivo", editable: 'onAdd', validate: (row) => (row.cultivo || "").length !== 0,
    lookup: {
      MELON: 'MELÓN',
      CANA: 'CANA',
      // Agrega más opciones aquí, cada clave es el valor guardado y el valor de la clave es el texto mostrado
    },
  },*/
  { title: "Labor", field: "labor", editable: 'onAdd', validate: (row) => (row.labor || "").length !== 0 },
  { title: "Departamento", field: "departamento" },
  { title: "Descripción", field: "descripcion" },
];

export function Labores() {
  const [data, setData] = useState([]);
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await laboresService.getAll();
        if (response.success) {
          // Accede a los valores de labores correctamente
          const labores = response.labores.$values || []; // Acceder a $values
          setData(labores); // Establecer el estado con el arreglo de labores
          console.log("Labores obtenidos:", labores); // Verifica los datos que recibes
        } else {
          console.log("No se pudieron obtener los labores.");
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
        title="Gestión de labores"
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
            emptyDataSourceMessage: 'No se encontraron labores',
            editRow: {
              deleteText: '¿Estás seguro de que deseas eliminar este labor?', // Cambia el mensaje de confirmación
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
                //...newData,
                Labor: newData.labor,
                Departamento: newData.departamento,
                Descripcion: newData.descripcion
              }

              /*const isDuplicate = data.some(variante =>
                variante.cultivo.toUpperCase() === newDataWithId.cultivo &&
                variante.variedad.toUpperCase() === newDataWithId.variedad
              );

              if (isDuplicate) {
                showToast('error', 'Ya existe esa variedad con ese cultivo', '#9c1010');
                reject(`Error al crear la variedad: ${response.message}`);
                return
              }*/
              laboresService.create(newDataWithId)
                .then(response => {
                  if (response.success) {
                    console.log("Labor creado exitosamente");
                    setData(prevData => [ newDataWithId , ...prevData]);
                    showToast('success', 'Labor creada', '#2d800e');
                    resolve(); // Resolvemos la promesa si todo fue bien
                  } else {
                    reject(`Error al crear el labor: ${response.message}`);
                  }
                })
                .catch(error => {
                  reject(`Error de red: ${error.message}`);
                });

            })
          },
          onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
              const index = data.findIndex(item => item.labor === oldData.labor);
              const updatedData = [...data];

              const newDataWithId = {
                ...newData,
                labor: newData.labor,
                departamento: newData.departamento,
                descripción: newData.descripción
              }

              /*const isDuplicate = data.some((variante , idx) => 
                idx !== index&&
                variante.cultivo.toUpperCase() === newData.cultivo &&
                variante.variedad.toUpperCase() === newData.variedad
            );
             console.log(updatedData)
            if(isDuplicate){
                showToast('error', 'Ya existe esa variedad con ese cultivo','#9c1010'); 
                reject(`Error al crear la variedad: ${response.message}`);
                return
              }*/
              updatedData[index] = newDataWithId;

              laboresService.update(oldData.labor, oldData.departamento, newDataWithId) // Asumiendo que `oldData` tiene un campo `id`
                .then(response => {
                  if (response.success) {
                    setData(updatedData);
                    showToast('success', 'Labor actualizada', '#2d800e');
                    resolve();
                  } else {
                    reject(`Error al actualizar el labor: ${response.message}`);
                    showToast('error', '`Error al actualizar el labor', '#9c1010');
                  }
                })
                .catch(error => {
                  reject(`Error de red: ${error.message}`);
                });

            })

          },
          onRowDelete: (oldData) => {
            return new Promise((resolve, reject) => {
              laboresService.delete(oldData.labor, oldData.departamento) // Llama a la función de eliminación
                .then(response => {
                  if (response.success) {
                    const dataDelete = data.filter(
                      (el) => !(el.labor === oldData.labor)
                    );
                    setData(dataDelete);
                    showToast('success', 'Labor eliminada', '#2d800e');
                    resolve();
                  } else {

                    showToast('error', '`Error al elimanr el labor', '#9c1010');
                    reject('No se pudo eliminar el labor.');
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
const Container = styled.div`
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
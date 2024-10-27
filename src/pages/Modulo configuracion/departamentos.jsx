import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, { useState, useEffect  } from "react";
import { Delete, Edit, AddBox } from '@mui/icons-material';
import { DepartamentoService } from "../../services/DepartamentoService";
import { showToast } from "../../components/helpers";

var departamentoService = new DepartamentoService;

const columns = [
    { title: "Departamento", field: "departamento", editable: 'onAdd',validate: (row) => (row.departamento || "").length !== 0,  },
    { title: "Encargado", field: "encargado", type: "string" },
    { title: "Descripción", field: "descripcion" },
];

export function Departamento(){
    const [data, setData] = useState([]);
    const [maxBodyHeight, setMaxBodyHeight] = useState(480);
    //Agregar
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await departamentoService.getAll();
                if (response.success) {
                    setData(response.departamentos); 
                    console.log("Departamentos", response.departamentos);
                } else {
                  
                  setData([]); 
                  console.log(response.message);
                }
            } catch (error) {
              showToast('error', error,'#9c1010'); 
              console.error("Error al obtener los departamentos:", error);
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
       title="Gestión de departamentos"
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
            deleteText: '¿Estás seguro de que deseas eliminar este departamento?', // Cambia el mensaje de confirmación
            cancelTooltip: 'Cancelar', // Texto del botón de cancelar
            saveTooltip: 'Confirmar',  // Texto del botón de confirmar
          },
          editTooltip: 'Editar',
          deleteTooltip: 'Eliminar',
          addTooltip: 'Agregar',
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
            try{
            const newDataWithId = {
                departamento: newData.departamento.toUpperCase(),
                encargado: newData.encargado ? newData.encargado.toUpperCase() : '',
                descripcion: newData.descripcion ? newData.descripcion.toUpperCase() : ''
            }

            const isDuplicate = data.some(departamentos => departamentos.departamento === newDataWithId.departamento)
            //console.log(newDataWithId.departamento)
            if(isDuplicate){
              showToast('error', 'Ya existe ese departamento','#9c1010'); 
              reject(`Error al crear el producto: ${response.message}`);
              return
            }
         
                    departamentoService.create(newDataWithId)
                        .then(response => {
                            if (response.success) {
                                console.log("Departamento creado exitosamente");
                                setData(prevData => [...prevData, newDataWithId]);
                                showToast('success', 'Departamento creado', '#2d800e');
                                resolve(); // Resolvemos la promesa si todo fue bien
                            } else {
                                
                                reject(`Error al crear el departamento: ${response.message}`);
                            }
                        })
                        .catch(error => {
                          //console.log(error)
                          showToast('error', error,'#9c1010'); 
                          reject(`Error de red: ${error.message}`);
                        });
                    }catch(error){
                        console.log(error)
                        reject('Ocurrió un error inesperado');
                    }

              });
           
        },
        onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
            try{
            const index = data.findIndex(item => item.departamento === oldData.departamento);
            const updatedData = [...data];
            const newDataWithId = {
                ...newData,
                departamento: newData.departamento.toUpperCase(),
                encargado: newData.encargado ? newData.encargado.toUpperCase() : '',
                descripcion: newData.descripcion ? newData.descripcion.toUpperCase() : ''
            };

            const isDuplicate = updatedData.some((item, idx) => item.departamento === newDataWithId.departamento && idx !== index);
            if (isDuplicate) {
                showToast('error', 'Ya existe ese departamento', '#9c1010');
                reject('Error al actualizar el producto: El departamento ya existe');
                return;
            }

            updatedData[index] = newDataWithId;

            departamentoService.update(oldData.departamento, newDataWithId) // Asumiendo que `oldData` tiene un campo `id`
                  .then(response => {
                      if (response.success) {
                          setData(updatedData);
                          showToast('success', 'Departamento actualizado', '#2d800e');
                          resolve();
                      } else {
                          reject(`Error al actualizar el departamento: ${response.message}`);
                          showToast('error', '`Error al actualizar el departamento', '#9c1010');
                      }
                  })
                  .catch(error => {
                    showToast('error', error,'#9c1010'); 
                    reject(`Error de red: ${error.message}`);
                  });
               }catch(error){
                  console.log(error)
                  reject('Ocurrió un error inesperado');
              }
            })

        },
        onRowDelete: (oldData) => { 
            return new Promise((resolve, reject) => {
              try{
                departamentoService.delete(oldData.departamento) // Llama a la función de eliminación
                .then(response => {
                    if (response.success) {
                        const dataDelete = data.filter((el) => el.departamento !== oldData.departamento);
                        setData(dataDelete);
                        resolve();
                    } else {
                        reject('No se pudo eliminar el departamento.');
                    }
                })
                .catch(error => {
                  showToast('error', error,'#9c1010'); 
                  reject(`Error al eliminar: ${error.message}`);
                });
              }catch(error){
                console.log(error)
                reject('Ocurrió un error inesperado');}
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

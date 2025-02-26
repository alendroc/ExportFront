import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, { useState, useEffect } from "react";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import { showToast } from "../../components/helpers";
import { ArticulosService } from "../../services/ArticulosService";
var articulosService = new ArticulosService;

const columns = [
    { title: "ID de articulo", field: "idArticulo",   editable: 'onAdd',  validate: (rowData) => {
        // Expresión regular para el formato NNNN-NN-NN-NN-NN
        const regex =/([A-Za-z0-9]{4})-([A-Za-z0-9]{2})-([A-Za-z0-9]{2})-([A-Za-z0-9]{2})-([A-Za-z0-9]{2})/;
        
        if (rowData.idArticulo?.length > 20) {
          return { isValid: false, helperText: "El límite de la columna es de 20 carácteres" };
        }

        return regex.test(rowData.idArticulo) ? true : { isValid: false, helperText: "Formato: xxxx-xx-xx-xx-xx" };
    }},

    { title: "Nombre de articulo", headerStyle: { minWidth: 120 },  field: "nombreArticulo",validate: (row) =>{
      if((row.nombreArticulo || "").length === 0)return false 

      if(row.nombreArticulo?.trim() ===""){
        return {isValid: false,helperText: "No se permite el campo vacío"};
    } 
      if(row.nombreArticulo?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"};
        }
    }},
  
    { title: "Marca",  headerStyle: { minWidth: 50 }, field: "marca",validate: (row) => {
      if((row.marca || "").length === 0){return false}
      if(row.marca?.trim() ===""){
        return {isValid: false,helperText: "No se permite el campo vacío"};
    } 
      if(row.marca?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"};
        }
    } },

    { title: "Modelo", width: "50px", field: "modelo",validate: (row) => {
      if((row.modelo || "").length === 0){return false}
      if(row.modelo?.trim() ===""){
        return {isValid: false,helperText: "No se permite el campo vacío"};
    } 
      if(row.modelo?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"};
        }
     } },

    { title: "N° de Chasis", field: "numeroChasis", validate: (row) =>{
      if(row.numeroChasis?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"};
        }
    } },

    { title: "N° de motor", field: "numeroMotor" ,validate: (row) =>{
      if(row.numeroMotor?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"};
        }
    }},

    { title: "N° de placa", field: "placa" ,validate: (row) =>{
      if(row.placa?.length > 10){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 10 carácteres"};
        }
    }},

    { title: "Tipo", headerStyle: { minWidth: 20, }, field: "tipo",validate: (row) => {
      if((row.tipo || "").length === 0){return false}
      if(row.tipo?.trim() ===""){
        return {isValid: false,helperText: "No se permite el campo vacío"};
    } 
      if(row.tipo?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"};
        }
    } },

    { title: "Observaciones", field: "observaciones",validate: (row) =>{
      if(row.observaciones?.length > 500){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 500 carácteres"};
        }
    } },
];
export function Articulos() {
  const [data, setData] = useState([]);
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);
  //Agregar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await articulosService.getAll();
        if (response.success) {
          setData(response.articulos);
          console.log("Articulos", response.articulos);
        } else {
          console.log("No se pudieron obtener los articulos.");
        }
      } catch (error) {
        console.error("Error al obtener los aticulos:", error);
      }
    };
    fetchData();
  }, []);

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
      <MaterialTable size="small"
        title="Gestión de Artículos"
        data={data}
        columns={columns}
        options={{
          actionsColumnIndex: -1,
          maxBodyHeight: maxBodyHeight,
          addRowPosition: "first",
          padding:  "dense",
          paging: false,
          headerStyle: {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: '#e8e8e8',
            borderRadius: 0
          },
        }}
        icons={{
          Add: () => <AddBox style={{ fontSize: "25px", color: "white" }} />, // Cambia el tamaño del ícono de agregar
          Edit: () => <Edit style={{ fontSize: "18px" }} />, // Cambia el tamaño del ícono de editar
          Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />, // Cambia el tamaño y color del ícono de eliminar

        }}
        localization={{
          body: {
            emptyDataSourceMessage: 'No se encontraron artículos',
            editRow: {
              deleteText: '¿Estás seguro de que deseas eliminar este articulo?', // Cambia el mensaje de confirmación
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
                color: newData.color = "nada",
                idArticulo: newData.idArticulo.toUpperCase(),
                nombreArticulo: newData.nombreArticulo.toUpperCase(),
                tipo: newData.tipo.toUpperCase(),
                marca: newData.marca.toUpperCase(),
                modelo: newData.modelo.toUpperCase(),
                numeroChasis: newData.numeroChasis ? newData.numeroChasis.toUpperCase() : "",
                numeroMotor: newData.numeroMotor ? newData.numeroMotor.toUpperCase() : "",
                placa: newData.placa ? newData.placa.toUpperCase() : "",
                observaciones: newData.observaciones ? newData.observaciones.toUpperCase() : ""
              }
              console.log(newDataWithId)
              const isDuplicate = data.some(articu => articu.idArticulo === newDataWithId.idArticulo)

              if (isDuplicate) {
                showToast('error', 'Ya existe ese Articulo', '#9c1010');
                reject(`Error al crear el producto: ${response.message}`);
                return
              }
              articulosService.create(newDataWithId)
                .then(response => {
                  if (response.success) {
                    console.log("Articulo creado exitosamente");
                    setData(prevData => [newDataWithId, ...prevData]);
                    showToast('success', 'Articulo creado', '#2d800e');
                    resolve(); // Resolvemos la promesa si todo fue bien
                  } else {
                    reject(`Error al crear el Articulo: ${response.message}`);
                  }
                })
                .catch(error => {
                  reject(`Error de red: ${error.message}`);
                });
            });

          },
          onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
              const index = data.findIndex(item => item.idArticulo === oldData.idArticulo);
              const updatedData = [...data];

              const newDataWithId = {
                ...newData,
                color: newData.color = "nada",
                idArticulo: newData.idArticulo.toUpperCase(),
                nombreArticulo: newData.nombreArticulo.toUpperCase(),
                tipo: newData.tipo.toUpperCase(),
                marca: newData.marca.toUpperCase(),
                modelo: newData.modelo.toUpperCase(),
                numeroChasis: newData.numeroChasis ? newData.numeroChasis.toUpperCase() : "",
                numeroMotor: newData.numeroMotor ? newData.numeroMotor.toUpperCase() : "",
                placa: newData.placa ? newData.placa.toUpperCase() : "",
                observaciones: newData.observaciones ? newData.observaciones.toUpperCase() : ""
              }

              const isDuplicate = updatedData.some((season, idx) => season.idArticulo === newDataWithId.idArticulo && idx !== index);
              if (isDuplicate) {
                showToast('error', 'Ya existe este articulo', '#9c1010');
                reject('Error al actualizar el articulo: el articulo ya existe');
                return;
              }

              updatedData[index] = newDataWithId;

              articulosService.update(oldData.idArticulo, newDataWithId) // Asumiendo que `oldData` tiene un campo `id`
                .then(response => {
                  if (response.success) {
                    setData(updatedData);
                    showToast('success', 'Articulo actualizado', '#2d800e');
                    resolve();
                  } else {
                    reject(`Error al actualizar el articulo: ${response.message}`);
                    showToast('error', '`Error al actualizar el articulo', '#9c1010');
                  }
                })
                .catch(error => {
                  reject(`Error de red: ${error.message}`);
                });
            })

          },
          onRowDelete: (oldData) => {
            return new Promise((resolve, reject) => {
              articulosService.delete(oldData.idArticulo) // Llama a la función de eliminación
                .then(response => {
                  if (response.success) {
                    const dataDelete = data.filter((el) => el.idArticulo !== oldData.idArticulo);
                    setData(dataDelete);
                    showToast('success', 'Articulo eliminado', '#2d800e');
                    resolve();
                  } else {

                    showToast('error', '`Error al eliminar el articulo', '#9c1010');
                    reject('No se pudo eliminar el articulo.');
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
const Container = styled.div`
 display: block;
 width: 100%;
//max-width: 1100px;
z-index: 1;
     .MuiToolbar-root {
      background-color: #50ad53; /* Cambia el color del fondo del toolbar */
      color: white; /* Cambia el color del texto del toolbar */
      }

  .MuiTableCell-root {
     border-radius: 20px;
     padding: 4px 8px; 
     font-size: 11px !important;
   }
 
   .MuiTableRow-root {
     height: 30px; /* Cambia la altura de las filas */
   }
   .MuiTypography-h6 {
 font-size: 16px; /* Cambia este valor al tamaño deseado */
  }
  @media (min-width: 1200px){
    .MuiTableCell-root {
     padding: 0 8px; 
     font-size: 12px !important;
   }
  }
  @media (min-width: 1600px) {
 max-width: 1400px;
 .MuiTypography-h6 {
   font-size: 20px; /* Tamaño de fuente para el título en pantallas grandes */
 }
 .MuiTableCell-root {
     padding: 0 8px; 
     font-size: 16px !important;
   }
 }
  `
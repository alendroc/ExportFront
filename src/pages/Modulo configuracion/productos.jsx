import styled from "styled-components";
import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { ProductoService } from "../../services/ProductoService";
import { Delete, Edit, AddBox } from '@mui/icons-material'; 
import { showToast } from "../../components/helpers";

var productoService = new ProductoService();

export function Productos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);

  useEffect(() => {
    productoService.getAll()
      .then((response) => {
        if (response.success) {
          setData(response.productos);
          console.log("Productos", response.productos);
        } else {
          console.log("No se pudieron obtener los productos.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
        setLoading(false);
      });
  }, []);

  
  const EDITABLE_COLUMNS = [
    { 
      title: "Producto", 
      field: "idProducto", 
      editable: 'onAdd', 
      validate: (rowData) => {
      const regex =/([A-Za-z0-9]{2})-([A-Za-z0-9]{4})/;
      return regex.test(rowData.idProducto) ? true : { isValid: false, helperText: " xx-xxxx" 
      };
    }
    },
    { 
      title: "Nombre Descriptivo", 
      field: "nombreDescriptivo", 
      editable: 'always', 
      validate: rowData => rowData.nombreDescriptivo ? true : { isValid: false, helperText: "Campo obligatorio" }
    },
    { 
      title: "Tipo de Uso", 
      field: "tipoUso", 
      editable: 'always',
      headerStyle: { minWidth: 100 }
    },
    { 
      title: "Nombre Comercial", 
      field: "nombreComercial", 
      editable: 'always', 
      validate: rowData => rowData.nombreComercial ? true : { isValid: false, helperText: "Campo obligatorio" }
    },
    { 
      title: "Unidad de Medida", 
      field: "unidadMedida", 
      editable: 'always', 
      headerStyle: { minWidth: 100 },
      validate: rowData => rowData.unidadMedida ? true : { isValid: false, helperText: "Campo obligatorio" }
      
    },
    { 
      title: "Ingrediente Activo", 
      field: "ingredienteActivo", 
      editable: 'always' 
    },
    { 
      title: "Concentracion Iactivo", 
      field: "concentracionIactivo", 
      editable: 'always' 
    },
    { 
      title: "Restricción Ingreso", 
      field: "restriccionIngreso", 
      //type: "numeric", 
      editable: 'always' 
    },
    { 
      title: "Descripción", 
      field: "descripcion", 
      editable: 'always' 
    },
    { 
      title: "Activo", 
      field: "activo", 
      type: "boolean", 
      editable: 'always'
    }
  ];
  

  function getNewDataBulkEdit(changes, copyData) {
    const keys = Object.keys(changes);
    keys.forEach((key) => {
      if (changes[key] && changes[key].newData) {
        const targetDataIndex = copyData.findIndex((el) => el.idProducto === key);
        if (targetDataIndex > -1) {
          copyData[targetDataIndex] = changes[key].newData;
        }
      }
    });
    return [...copyData];
  }

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
        title="Lista de Productos"
        columns={EDITABLE_COLUMNS || []}
        data={data}
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
              backgroundColor: '#cacaca5f',
              borderRadius: 0
            },
        }}
        icons={{
          Add: () => <AddBox style={{ fontSize: "25px", color: "white" }} />,
          Edit: () => <Edit style={{ fontSize: "18px" }} />,
          Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />,
        }}
        localization={{
          body: {
            emptyDataSourceMessage: 'No se encontraron productos',
            editRow: {
              deleteText: '¿Estás seguro de que deseas eliminar este producto?', // Cambia el mensaje de confirmación
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
          onRowAddCancelled: (rowData) => console.log("Agregar cancelado"),
          onRowUpdateCancelled: (rowData) => console.log("Edición cancelada"),

          onRowAdd: (newData) => {
            return new Promise((resolve, reject) => {
              console.log("Intentando agregar producto:", newData);
              const newDataWithId = {
                ...newData,
                idProducto: newData.idProducto,
                activo: newData.activo !== undefined ? newData.activo : false,
                nombreDescriptivo: newData.nombreDescriptivo.toUpperCase(),
                tipoUso: newData.tipoUso.toUpperCase(),
                nombreComercial: newData.nombreComercial.toUpperCase(),
                ingredienteActivo: newData.ingredienteActivo.toUpperCase(),
                concentracionIactivo: newData.concentracionIactivo.toUpperCase(),
                descripcion: newData.descripcion.toUpperCase()
              };
          
              const requiredFields = [
                "idProducto", 
                "nombreDescriptivo",
                "tipoUso",
                "nombreComercial",
                "unidadMedida"
              ];
          
              const missingFields = requiredFields.filter(field => !newDataWithId[field] && newDataWithId[field] !== false);
              if (missingFields.length > 0) {
                showToast('error', `Faltan los siguientes campos: ${missingFields.join(", ")}`, '#9c1010');
                reject(`Faltan los siguientes campos: ${missingFields.join(", ")}`);
                return;
              }
          
              productoService.create(newDataWithId)
                .then(response => {
                  if (response.success) {
                    setData(prevData => [response.producto, ...prevData ]);
                    showToast('success', 'Producto creado exitosamente', '#2d800e');
                    resolve();
                  } else {
                    showToast('error', `Error al crear el producto: ${response.message}`, '#9c1010');
                    reject(`Error al crear el producto: ${response.message}`);
                  }
                })
                .catch(error => {
                  showToast('error', `Error de red: ${error.message}`, '#9c1010');
                  reject(`Error de red: ${error.message}`);
                });
            });
          },
          
          onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
                // Convierte los campos a mayúsculas antes de la actualización
                const updatedData = {
                    ...newData,
                    nombreDescriptivo: newData.nombreDescriptivo.toUpperCase(),
                    tipoUso: newData.tipoUso.toUpperCase(),
                    nombreComercial: newData.nombreComercial.toUpperCase(),
                    ingredienteActivo: newData.ingredienteActivo.toUpperCase(),
                    concentracionIactivo: newData.concentracionIactivo.toUpperCase(),
                    descripcion: newData.descripcion.toUpperCase()
                };
        
                productoService.update(oldData.idProducto, updatedData)
                    .then(response => {
                        if (response.success) {
                            productoService.getAll()
                                .then((getAllResponse) => {
                                    if (getAllResponse.success) {
                                        setData(getAllResponse.productos);
                                        showToast('success', 'Producto actualizado correctamente', '#2d800e');
                                        resolve();
                                    } else {
                                        showToast('error', "Error al obtener los productos actualizados", '#9c1010');
                                        reject("Error al obtener los productos actualizados");
                                    }
                                })
                                .catch(error => {
                                    showToast('error', `Error al obtener los productos actualizados: ${error.message}`, '#9c1010');
                                    reject(`Error al obtener los productos actualizados: ${error.message}`);
                                });
                        } else {
                            showToast('error', "Error al actualizar el producto", '#9c1010');
                            reject("Error al actualizar el producto");
                        }
                    })
                    .catch(error => {
                        showToast('error', `Error: ${error.message}`, '#9c1010');
                        reject(`Error: ${error.message}`);
                    });
            });
        },        
          
          
          onRowDelete: (oldData) => {
            return new Promise((resolve, reject) => {
              productoService.delete(oldData.idProducto)  
                .then(response => {
                  if (response.success) {
                    setData(prevData => prevData.filter((el) => el.idProducto !== oldData.idProducto));
                    showToast('success', 'Producto eliminado exitosamente', '#2d800e');
                    resolve();
                  } else {
                    showToast('error', "Error al eliminar el producto", '#9c1010');
                    reject("Error al eliminar el producto");
                  }
                })
                .catch(error => {
                  showToast('error', error.message, '#9c1010');
                  reject(error.message);
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
max-width: 1020px;
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
 @media (min-width: 1400px){
  max-width: 1250px;
   .MuiTableCell-root {
    padding: 0 8px; 
    font-size: 12px !important;
  }
 }
 @media (min-width: 1600px) {
  width: 100%;
  max-width: 1450px;
.MuiTypography-h6 {
  font-size: 20px; /* Tamaño de fuente para el título en pantallas grandes */
}
.MuiTableCell-root {
    padding: 0 8px; 
    font-size: 16px !important;
  }
}
 `

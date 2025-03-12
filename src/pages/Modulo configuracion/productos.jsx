import styled from "styled-components";
import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { ProductoService } from "../../services/ProductoService";
import { Delete, Edit, AddBox } from '@mui/icons-material'; 
import { showToast } from "../../components/helpers";
import { CertificacionService } from "../../services/CertificacionService";

const productoService = new ProductoService();
const certificacionService = new CertificacionService();

export function Productos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);
  const [certificationData, setCertificationData] = useState({}); 

  useEffect(() => {  
    const fetchProductos = async () => {  
      setLoading(true);  
      try {  
        const response = await productoService.getAll();
        if (response.success) {  
          setData(response.productos);  
        } else {  
          console.log("No se pudieron obtener los productos.");  
        }  
      } catch (error) {  
        console.error("Error al obtener los productos:", error);  
      }  
      setLoading(false);  
    };  

    fetchProductos();  
  }, []);  

  const fetchCertificacionesById = async (idProducto) => {  
  if (!idProducto) return;  

  try {  
    const response = await certificacionService.getByProductoId(idProducto);  

    if (response.success) {  
      setCertificationData(prev => ({  
        ...prev,  
        [idProducto]: response.certificaciones,  
      }));  
      console.log("Certificaciones obtenidas para", idProducto, response.certificaciones); // Agrega este log  
    
    } else {  
      console.log(`No se encontraron certificaciones para el producto ${idProducto}`);  
    }  
  } catch (error) {  
    console.error(`Error al obtener certificaciones para el producto ${idProducto}:`, error);  
  }  
};
  
useEffect(() => {  
  const uniqueIds = [...new Set(data.map(p => p.idProducto.trim()))].filter(Boolean);  
  if (uniqueIds.length > 0) {  
    uniqueIds.forEach(fetchCertificacionesById);  
  }  
}, [data]);


const EDITABLE_COLUMNS = [
  { 
    title: "Producto", 
    field: "idProducto", 
    editable: 'onAdd', 
    validate: (rowData) => {
      const regex = /([A-Za-z0-9]{2})-([A-Za-z0-9]{4})/;
      return regex.test(rowData.idProducto) ? true : { isValid: false, helperText: "Formato inválido (xx-xxxx)" };
    }
  },
  {
    title: "Nombre Descriptivo",
    field: "nombreDescriptivo",
    editable: 'always',
    validate: rowData => {
      const trimmedValue = rowData.nombreDescriptivo?.trim();
      return trimmedValue ? true : { isValid: false, helperText: "Campo obligatorio" };
    }
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
    validate: rowData => {
      const trimmedValue = rowData.nombreComercial?.trim();
      return trimmedValue ? true : { isValid: false, helperText: "Campo obligatorio" };
    }
  },
  { 
    title: "Unidad de Medida", 
    field: "unidadMedida", 
    editable: 'always', 
    headerStyle: { minWidth: 100 },
    validate: rowData => {
      const trimmedValue = rowData.unidadMedida?.trim();
      return trimmedValue ? true : { isValid: false, helperText: "Campo obligatorio" };
    }
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
    editable: 'always' ,
     type:"numeric",
    validate: rowData => {
      const isDecimal = /^\d*\.?\d+$/.test(rowData.restriccionIngreso);
      if(!rowData.restriccionIngreso){return true}

      return rowData.restriccionIngreso && isDecimal  ? { isValid: true, helperText: "numeros decimales ejemplo: 12,4" }: false;
  }
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
  },  
  {   
    title: "Certificación Relacionada",   
    field: "certificacion",   
    editable: 'never',  
    render: (rowData) => {  
      const certs = certificationData[rowData.idProducto] || [];  
      return certs.length > 0 ? certs.map(cert => cert.nombreCertificacion).join(", ") : null;  
    }    
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
              backgroundColor: '#e8e8e8',
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
                activo: newData.activo !== undefined ? newData.activo : false,  
                nombreDescriptivo: newData.nombreDescriptivo.toUpperCase(),  
                tipoUso: newData.tipoUso.toUpperCase(),  
                nombreComercial: newData.nombreComercial.toUpperCase(),  
                ingredienteActivo: newData.ingredienteActivo?.toUpperCase() ?? "",  
                concentracionIactivo: newData.concentracionIactivo?.toUpperCase() ?? "",  
                descripcion: newData.descripcion?.toUpperCase() ?? ""  
              };  
          
              const requiredFields = [
                "idProducto", 
                "nombreDescriptivo",
                "tipoUso",
                "nombreComercial",
                "unidadMedida"
              ];
          
              const emptyFields = requiredFields.filter(field => {  
                const value = newData[field]?.trimStart(); // Elimina espacios en blancos  
                return !value; // Verifica si es una cadena vacía  
              });  
          
              if (emptyFields.length > 0) {  
                showToast('error', `Los siguientes campos están vacíos: ${emptyFields.join(", ")}`, '#9c1010');  
                reject(`Los siguientes campos están vacíos: ${emptyFields.join(", ")}`);  
                return;  
              }  
          

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
                const updatedData = {  
                  ...newData,  
                  nombreDescriptivo: newData.nombreDescriptivo.toUpperCase(),  
                  tipoUso: newData.tipoUso.toUpperCase(),  
                  nombreComercial: newData.nombreComercial.toUpperCase(),  
                  ingredienteActivo: newData.ingredienteActivo?.toUpperCase() ?? "",  
                  concentracionIactivo: newData.concentracionIactivo?.toUpperCase() ?? "",  
                  descripcion: newData.descripcion?.toUpperCase() ?? ""  
                };  
        
                const requiredFields = [  
                  "nombreDescriptivo",   
                  "tipoUso",   
                  "nombreComercial",  
                  "unidadMedida"  
                ];  

                const emptyFields = requiredFields.filter(field => {  
                  const value = newData[field]?.trim(); 
                  return !value;  
                });  
                
                if (emptyFields.length > 0) {  
                  showToast('error', `Los siguientes campos están vacíos: ${emptyFields.join(", ")}`, '#9c1010');  
                  reject(`Los siguientes campos están vacíos: ${emptyFields.join(", ")}`);  
                  return;  
                }  

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
width: 100%;
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

 @media (min-width: 720PX){
  max-width: 960PX;
  
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

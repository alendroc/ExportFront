import styled from "styled-components";
import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { ProductoService } from "../../services/ProductoService";
import { Delete, Edit, AddBox } from '@mui/icons-material'; 

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
    { title: "Producto", field: "idProducto" }, 
    { title: "Nombre Descriptivo", field: "nombreDescriptivo" },
    { title: "Tipo de Uso", field: "tipoUso" },
    { title: "Nombre Comercial", field: "nombreComercial" },
    { title: "Unidad de Medida", field: "unidadMedida" },
    { title: "Ingrediente Activo", field: "ingredienteActivo" },
    { title: "ConcentracionIactivo", field: "concentracionIactivo" },
    { title: "Restricción Ingreso", field: "restriccionIngreso" },
    { title: "Descripción", field: "descripcion" },
    { title: "Activo", field: "activo", type: "boolean" },
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
          Add: () => <AddBox style={{ fontSize: "25px", color: "white" }} />,
          Edit: () => <Edit style={{ fontSize: "18px" }} />,
          Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />,
        }}
        localization={{
          body: {
            editRow: {
              deleteText: "¿Estás seguro de que deseas eliminar este producto?",
              cancelTooltip: "Cancelar",
              saveTooltip: "Confirmar",
            },
          },
          header: {
            actions: "Acciones",
          },
        }}
        editable={{
          onBulkUpdate: (changes) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                let copyData = [...data];
                setData(getNewDataBulkEdit(changes, copyData));
                resolve();
              }, 1000);
            });
          },
          onRowAddCancelled: (rowData) => console.log("Agregar cancelado"),
          onRowUpdateCancelled: (rowData) => console.log("Edición cancelada"),

          onRowAdd: (newData) => {
            return new Promise((resolve, reject) => {
              console.log("Intentando agregar producto:", newData);
              const newDataWithId = {
                ...newData,
                idProducto: newData.idProducto,
                activo: newData.activo !== undefined ? newData.activo : false  
              };
          
              const requiredFields = [
                "idProducto", 
                "nombreDescriptivo",
                "tipoUso",
                "nombreComercial",
                "unidadMedida",
                "ingredienteActivo",
                "concentracionIactivo",
                "restriccionIngreso",
                "descripcion",
                "activo"  
              ];
          
              const missingFields = requiredFields.filter(field => !newDataWithId[field] && newDataWithId[field] !== false);
              if (missingFields.length > 0) {
                reject(`Faltan los siguientes campos: ${missingFields.join(", ")}`);
                return;
              }
          
              productoService.create(newDataWithId)
                .then(response => {
                  if (response.success) {
                    setData(prevData => [...prevData, response.producto]);
                    resolve();
                  } else {
                    reject(`Error al crear el producto: ${response.message}`);
                  }
                })
                .catch(error => {
                  reject(`Error de red: ${error.message}`);
                });
            });
          },
          
          onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
              productoService.update(oldData.idProducto, newData)
                .then(response => {
                  if (response.success) {
                    productoService.getAll()
                      .then((getAllResponse) => {
                        if (getAllResponse.success) {
                          setData(getAllResponse.productos); 
                          resolve();
                        } else {
                          reject("Error al obtener los productos actualizados");
                        }
                      })
                      .catch(error => {
                        reject(`Error al obtener los productos actualizados: ${error.message}`);
                      });
                  } else {
                    reject("Error al actualizar el producto");
                  }
                })
                .catch(error => {
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
                    resolve();
                  } else {
                    reject("Error al eliminar el producto");
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

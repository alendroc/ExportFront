import styled from "styled-components";
import MaterialTable from "@material-table/core";
import { useState, useEffect } from "react";
import { ProductoService } from "../../services/ProductoService";

var productoService = new ProductoService

export function Productos() {

    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true); 

  useEffect(() => {
    productoService.getAll().then((response) => {
      if (response.success) {
        setData(response.productos); 
        console.log("Productos", response.productos);
      } else {
        console.log("No se pudieron obtener los productos.");
      }
      setLoading(false); 
    }).catch(error => {
      console.error("Error al obtener los productos:", error);
      setLoading(false); 
    });
  }, []);
   
  const EDITABLE_COLUMNS = [
    { title: "Identificador", field: "identificador"},
    { title: "Nombre Descriptivo", field: "nombreDescriptivo" },
    { title: "Tipo de Uso", field: "tipoUso" },
    { title: "Nombre Comercial", field: "nombreComercial" },
    { title: "Unidad de Medida", field: "unidadMedida" },
    { title: "Ingrediente Activo", field: "ingredienteActivo" },
    { title: "Concentración Activo", field: "concentracionActivo"},
    { title: "Restriccion Ingreso", field: "restriccionIngreso"},
    { title: "Descripción", field: "descripcion" },
    { title: "Activo", field: "activo", type: "boolean" },
  ];

function getNewDataBulkEdit(changes, copyData) {
    const keys = Object.keys(changes);
    for (let i = 0; i < keys.length; i++) {
      if (changes[keys[i]] && changes[keys[i]].newData) {
        let targetData = copyData.find((el) => el.id === keys[i]);
        if (targetData) {
          let newTargetDataIndex = copyData.indexOf(targetData);
          copyData[newTargetDataIndex] = changes[keys[i]].newData;
        }
      }
    }
    return copyData;
  }

  return (
    <Container>
        
      <MaterialTable  
        title="Lista de Productos"
        columns={EDITABLE_COLUMNS}
        data={data}
        editable={{
          onBulkUpdate: (changes) => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                let copyData = [...data];
                setData(getNewDataBulkEdit(changes, copyData));
                resolve();
              }, 1000);
            });
          },
          onRowAddCancelled: (rowData) => console.log("Row adding cancelled"),
          onRowUpdateCancelled: (rowData) => console.log("Row editing cancelled"),
          onRowAdd: (newData) => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                newData.id = "uuid-" + Math.random() * 10000000;
                setData([...data, newData]);
                resolve();
              }, 1000);
            });
          },
          onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...data];
                const target = dataUpdate.find((el) => el.id === oldData.id);
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
                const dataDelete = data.filter((el) => el.id !== oldData.id);
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

const Container = styled.div``;


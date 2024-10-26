import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, {useState, useEffect  } from "react";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import { showToast } from "../../components/helpers";
import { ArticulosService } from "../../services/ArticulosService";
var articulosService = new ArticulosService;

const columns = [
    { title: "ID de articulo", field: "idArticulo", editable: 'onAdd',  validate: (rowData) => {
        // Expresión regular para el formato NNNN-NN-NN-NN-NN
        const regex =/([A-Za-z0-9]{4})-([A-Za-z0-9]{2})-([A-Za-z0-9]{2})-([A-Za-z0-9]{2})-([A-Za-z0-9]{2})/;
        return regex.test(rowData.idArticulo) ? true : { isValid: false, helperText: " xxxx-xx-xx-xx-xx" };
    }
},
    { title: "Nombre de articulo", field: "nombreArticulo",validate: (row) => (row.nombreArticulo || "").length !== 0 },
    { title: "Marca", field: "marca",validate: (row) => (row.marca || "").length !== 0 },
    { title: "Modelo", field: "modelo",validate: (row) => (row.modelo || "").length !== 0  },
    { title: "Número de Chacis", field: "numeroChasis" },
    { title: "Número de motor", field: "numeroMotor" },
    { title: "Número de placa", field: "placa" },
    { title: "Tipo", field: "tipo",validate: (row) => (row.tipo || "").length !== 0  },
    { title: "Observaciones", field: "observaciones" },
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
       title="Gestión de Articulos"
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
                color: newData.color = "nada",
                idArticulo: newData.idArticulo.toUpperCase(),
                nombreArticulo: newData.nombreArticulo.toUpperCase(),

            }
            const isDuplicate = data.some(articu => articu.idArticulo === newDataWithId.idArticulo)
            console.log(newDataWithId)
            if(isDuplicate){
              showToast('error', 'Ya existe ese Articulo','#9c1010'); 
              reject(`Error al crear el producto: ${response.message}`);
              return
            }
                    articulosService.create(newDataWithId)
                        .then(response => {
                            if (response.success) {
                                console.log("Articulo creado exitosamente");
                                setData(prevData => [...prevData, newDataWithId]);
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
         
        },
        onRowDelete: (oldData) => { 
            
        },
      }}
 
    />
    </Container>);
  }
  const Container =styled.div`
 display: block;
width: 95%;
max-width: 1200px;
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
  @media (max-width: 1200px){
    
  }
  @media (min-width: 1600px) {
    max-width: 1300px;
 .MuiTypography-h6 {
   font-size: 20px; /* Tamaño de fuente para el título en pantallas grandes */
 }
 .MuiTableCell-root {
     padding: 0 8px; 
     font-size: 16px !important;
   }
 }
  `
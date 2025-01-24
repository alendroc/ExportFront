import styled from "styled-components";
import MaterialTable,  { MTableToolbar }  from "@material-table/core";
import React, { useState, useEffect  } from "react";
import { LoteService } from "../../services/LoteService";
import { Select } from "@mui/material";
import { Search } from "@mui/icons-material";

var loteService = new LoteService;

const columnLote = [{title: 'Lote', field: 'nombreLote',  cellStyle: { fontSize: "10px", width: "auto" }},
  {title: 'Area', field: 'area', type: "numeric",cellStyle: { fontSize: "10px",  width: "auto"}},
];

const columnLoteDATOS = [{title: 'Lote', field: 'nombreLote', cellStyle: { fontSize: "10px", width: "auto" }},
{title: 'N° de siembra ', field: 'numSiembra', type: "numeric",cellStyle: { fontSize: "10px"}},
{title: 'Alias Lote', field: 'aliaslote', cellStyle: { fontSize: "10px"}},
{title: 'Fecha temporada', field: 'alias lote',type:"date", cellStyle: { fontSize: "10px"}},
{title: 'Area', field: 'area',type:"numeric", cellStyle: { fontSize: "10px" }},
{title: 'Orientacion', field: 'orientacion',type:"string", cellStyle: { fontSize: "10px"}},
{title: 'Fumig', field: 'fumig', cellStyle: { fontSize: "10px"}},
{title: 'Tipo plastico', field: 'TipPlastico', cellStyle: { fontSize: "10px", }},
{title: 'Densidad', field: 'densidad', cellStyle: { fontSize: "10px"  }},
{title: 'Colmenas por ha', field: 'colmenas', cellStyle: { fontSize: "10px" }},
{title: 'Prog fertilizado', field: 'fertilizado', cellStyle: { fontSize: "10px"}},
{title: 'Prog fitoproteccion', field: 'fitoproteccion', cellStyle: { fontSize: "10px"}},

];

export function AsignarLote() {
   const [data, setData] = useState([]);
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);
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
              size="small"
              data={data}
              title=''
              columns={columnLote || []}
              options={{ 
                selection: true,
                showSelectAllCheckbox: false,
                search: true,
                actionsColumnIndex: -1,
                addRowPosition: "first",
                maxBodyHeight: maxBodyHeight, 
                padding: onabort,
                paging: false, 
                headerStyle: {
                    position: 'sticky', 
                    top: 0,
                    zIndex: 1,
                    fontSize: "11px",
                    backgroundColor: '#fff',
                  },
                  toolbar: true,

                  searchFieldStyle: {
                    fontSize: "12px",
                    width: "120px",
                  },
                 
              }}
              style={{
                overflowX: 'auto',
               
              }}
              components={{
                Toolbar: (props) => (
                  <div style={{ backgroundColor: '#f89358', height: '60px',  }}>
                    <MTableToolbar {...props} />
                  </div>
                ),
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
                  searchPlaceholder: 'Buscar',
                },
              }}
              ></MaterialTable>
                
               <MaterialTable 
              size="small"
              title={<div style={{ fontSize: '18px', fontWeight:"bold"}}>Asignar lotes</div>}
              data={data}
              columns={columnLoteDATOS || []}
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
                    fontSize: "11px",
                    backgroundColor: '#fff',
                  },
                  searchFieldStyle: {
                    fontSize: "12px",
                    width: "120px",
                  },
              }}
              style={{
                overflowX: 'auto',
                margin: "0 0 0 20px",
                width: "700px",
              }}
            
              icons={{
                Add: () => <AddBox style={{ fontSize: "25px", color: "white" }} />, // Cambia el tamaño del ícono de agregar
                Edit: () => <Edit style={{ fontSize: "18px" }} />, // Cambia el tamaño del ícono de editar
                Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />, // Cambia el tamaño y color del ícono de eliminar
            }}
            components={{
              Toolbar: (props) => (
                <div style={{ backgroundColor: '#50ad53', height: '60px', color: 'white' }}>
                  <MTableToolbar {...props} />
                </div>
              ),
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
                  searchPlaceholder: 'Buscar',
                },
              }}
              ></MaterialTable>
        
    </Container>);
  }
  const Container =styled.div`
  display: flex;


  .MuiToolbar-root .MuiInputBase-root input::placeholder {
  color: #000000; /* Reemplaza con el color deseado */
  }
  .MuiSvgIcon-root .MuiSvgIcon-fontSizeSmall .css-120dh41-MuiSvgIcon-root{
    display: none !important;
  }
  
  `
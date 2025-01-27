import styled from "styled-components";
import MaterialTable,  { MTableToolbar }  from "@material-table/core";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import React, { useState, useEffect  } from "react";
import { LoteService } from "../../services/LoteService";
import { LotePOService } from "../../services/LotesPOService";
import { Select } from "@mui/material";
import { Search } from "@mui/icons-material";

var loteService = new LoteService;
var lotePoService = new LotePOService;

const columnLote = [{title: 'Lote', field: 'nombreLote', headerStyle:{padding:"0 0 0 5px"},  cellStyle: { fontSize: "10px",padding:"0 0 0 5px", width: "30px"}},
  {title: 'Area', field: 'area', type: "numeric",headerStyle:{padding:"0 8px 0 0", width: "30px"},cellStyle: { fontSize: "10px",padding:"0 8px 0 0",  width: "30px"}},
];

const columnLoteDATOS = [{title: 'Lote', field: 'nombreLote', cellStyle: { fontSize: "10px", width: "auto" }},
{title: 'N° de siembra ', field: 'siembraNum', type: "numeric",cellStyle: { fontSize: "10px"}},
{title: 'Alias Lote', field: 'aliasLote', cellStyle: { fontSize: "10px"}},
{title: 'Fecha Transplante', field: 'fechaTrasplante',type:"date", cellStyle: { fontSize: "10px"}},
{title: 'Area', field: 'area',type:"numeric", cellStyle: { fontSize: "10px" }},
{title: 'Orientacion', field: 'orientacion',type:"string", cellStyle: { fontSize: "10px"}},
{title: 'Fumig', field: 'fumig', cellStyle: { fontSize: "10px"}},
{title: 'Tipo plastico', field: 'tipoPlastico', cellStyle: { fontSize: "10px", }},
{title: 'Densidad', field: 'densidad', cellStyle: { fontSize: "10px"  }},
{title: 'Colmenas por Ha', field: 'colmenasPorHa', cellStyle: { fontSize: "10px" }},
{title: 'Prog Fertilizacion', field: 'progFertilizacion', cellStyle: { fontSize: "10px"}},
{title: 'Prog Fitoproteccion', field: 'progFitoProteccion', cellStyle: { fontSize: "10px"}},

];

export function AsignarLote() {
   const [data, setData] = useState([]);
   const [dataPo, setDataPo] = useState([]);
   const [selectedRow, setSelectedRow] = useState(null);

  const [maxBodyHeight, setMaxBodyHeight] = useState(480);
  const [widthNpdy, setwidthNpdy] = useState(700);

//cargar datos de los services
  const fetchData = async (service, setData, logName) => {
    try {
      const response = await service();
      console.log("response", response);
      if (response.success) {
        setData(response[logName]);
        console.log(logName, response[logName]);
      } else {
        console.log(`No se pudieron obtener los ${logName}.`);
      }
    } catch (error) {
      setData([])
      console.error(`Error al obtener los ${logName}:`, error);
    }
  };

  //modificar tamaño
  const handleResize = () => {
    if (window.innerWidth < 1300) {
      setMaxBodyHeight(470);
     setwidthNpdy(630);
    }else if (window.innerWidth < 2000) {
      setMaxBodyHeight(580);
      setwidthNpdy(950); 
    } else {
      setMaxBodyHeight(480);
      setwidthNpdy(1000);
    }
  };

  
  //cuando se actualizan los states
   useEffect(() => {
     fetchData(() => lotePoService.getAll(), setDataPo, "LotesPO");
     fetchData(() => loteService.getLotesActivos(), setData, "lotes");

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
                selectionProps: (rowData) => ({
                  onChange: () => {
                    setSelectedRow((prevRow) => (prevRow?.nombreLote === rowData.nombreLote ? null : rowData));
                    
                  },
                  checked: selectedRow?.nombreLote === rowData.nombreLote ? true : false
                }),
                showSelectAllCheckbox: false,
                showTextRowsSelected: false,
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
                  searchFieldStyle: {
                    fontSize: "12px",
                    width: "120px",
                    padding: "0",
                  },
                 
              }}
              style={{
                overflowX: 'auto',
              
                margin: "0 30px 0 0",
              }}
              components={{
                Toolbar: (props) => (
                  <div className="custom-toolbar" style={{ backgroundColor: '#f89358', height: '60px', color: 'white', paddingRight: '0' }}>
                    <MTableToolbar  {...props}  style={{
            padding: '0',
            top: '0' // Elimina el padding del MTableToolbar
          }}/>
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

              onRowClick={(event, rowData) => {
                setSelectedRow((prevRow) => (prevRow?.nombreLote === rowData.nombreLote ? null : rowData));
                
              }}
              onSelectionChange={(rows) => {
                if (rows.length > 0) {
                  setSelectedRow(rows[0]);
                  console.log("Fila seleccionada por checkbox:", rows[0]);
                } else {
                  setSelectedRow(null);
                }
              }}

              ></MaterialTable>

{/* es de prueba pero solo funciona para ver el checkbox */}

                
    <MaterialTable 
              size="small"
              title={<div style={{ fontSize: '18px', fontWeight:"bold"}}>Asignar lotes</div>}
              data={dataPo}
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

                width: widthNpdy,
              }}
            
              icons={{
                Add: () => <button
                title="Add New"
                class="group cursor-pointer outline-none hover:rotate-90 duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  class="stroke-green-700 fill-none group-hover:fill-green-100 group-active:stroke-green-200 group-active:fill-green-600 group-active:duration-0 duration-300"
                >
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke-width="1.5"
                  ></path>
                  <path d="M8 12H16" stroke-width="1.5"></path>
                  <path d="M12 16V8" stroke-width="1.5"></path>
                </svg>
              </button>
              , // Cambia el tamaño del ícono de agregar
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
                  emptyDataSourceMessage: 'No se encontraron lotes en este Programa Operativo',
                  editRow: {
                    deleteText: '¿Estás seguro de que deseas eliminar este lote del PO?', // Cambia el mensaje de confirmación
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
              editable={{
                onRowAddCancelled: (rowData) => console.log("Row adding cancelled"),
                onRowUpdateCancelled: (rowData) => console.log("Row editing cancelled"),
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      // Simula añadir la nueva fila a los datos existentes
                      const updatedData = [...dataPo, newData];
                      setDataPo(updatedData); // setDataPo debe ser tu función de estado para actualizar `dataPo`
                      resolve();
                    }, 600);
                  }),
              }}
              ></MaterialTable>
        
    </Container>);
  }
  const Container =styled.div`
 display: flex;
 gap: 20px; /* Espaciado entre tablas */

  .custom-toolbar .MuiToolbar-root {
    padding: 0 10px 0 0!important; 
  }

  .MuiToolbar-root .MuiInputBase-root input::placeholder {
  color: #000000; /* Reemplaza con el color deseado */
  }
  .MuiSvgIcon-root .MuiSvgIcon-fontSizeSmall .css-120dh41-MuiSvgIcon-root{
    display: none !important;
  }

  .MuiBox-root.css-p9qzma {
  /* Tus estilos personalizados aquí */
  position: absolute;
    left: -48px;
    border-radius: 10px;
    top: 70px;
}
  @media (min-width: 1200px){
    .MuiTableCell-root {
      padding: 4px 8px;
     font-size: 12px !important;
   }
  }
  @media (min-width: 1600px) {
 max-width: 1400px;
 .MuiTypography-h6 {
   font-size: 20px; /* Tamaño de fuente para el título en pantallas grandes */
 }
 .MuiTableCell-root {
     padding: 4px 8px; 
     font-size: 14px !important;
   }
  }
  
  `
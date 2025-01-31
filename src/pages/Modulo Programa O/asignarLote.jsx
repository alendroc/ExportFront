import styled from "styled-components";
import MaterialTable,  { MTableToolbar }  from "@material-table/core";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import React, { useState, useEffect  } from "react";
import { LoteService } from "../../services/LoteService";
import { LotePOService } from "../../services/LotesPOService";
import { Select } from "@mui/material";
import { Search } from "@mui/icons-material";
import { TemporadasService } from "../../services/TemporadasService";
import { showToast } from "../../components/helpers";

var loteService = new LoteService;
var lotePoService = new LotePOService;
var temporadaService= new TemporadasService;
const loteNoSeleccionadoText="Debe seleccionar un lote"

const columnLote = [{title: 'Lote', field: 'nombreLote', headerStyle:{padding:"0 0 0 5px"},  cellStyle: { fontSize: "10px",padding:"0 0 0 5px", width: "30px"}},
  {title: 'Area', field: 'area', type: "numeric",headerStyle:{padding:"0 8px 0 0", width: "30px"},cellStyle: { fontSize: "10px",padding:"0 8px 0 0",  width: "30px"}},
];



export function AsignarLote() {
   const [data, setData] = useState([]);
   const [dataPo, setDataPo] = useState([]);
   const [tempActiva, setTempActiva] = useState([]);
   const [selectedRow, setSelectedRow] = useState(null);

   const [activarSelectRow, setActivarSelectRow] = useState(true);

  const [maxBodyHeight, setMaxBodyHeight] = useState(480);
  const [widthNpdy, setwidthNpdy] = useState(700);


//cargar datos de los services
  const fetchData = async (service, setDta, logName) => {
    try {
      const response = await service();
      //console.log("response", response);
      if (response.success) {
        setDta(response[logName]);
        //console.log(logName, response[logName]);
      } else {
        console.log(`No se pudieron obtener los ${logName}.`);
      }
    } catch (error) {
      setDta([])
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
     fetchData(() => temporadaService.getActual(), setTempActiva, "temporadaActual");

     

     handleResize();
     window.addEventListener("resize", handleResize);
     return () => window.removeEventListener("resize", handleResize);
       }, []);
    
    return (
    <Container>
<div>Temporada: {tempActiva[0]?.temporada ??"No hay temporada activa"}</div>
        <MaterialTable 
              size="small"
              data={data}
              title=''
              columns={columnLote || []}
              options={{ 
                selection: true,
                selectionProps: (rowData) => ({
                  onChange: () => {
                    if(activarSelectRow){
                    setSelectedRow((prevRow) => (prevRow?.nombreLote === rowData.nombreLote ? null : rowData));
                    }
                    
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
                if(activarSelectRow)
                setSelectedRow((prevRow) => (prevRow?.nombreLote === rowData.nombreLote ? null : rowData));
                
              }}
              onSelectionChange={(rows) => {
                if (activarSelectRow && rows.length > 0) {
                  setSelectedRow(rows[0]);
                  console.log("Fila seleccionada por checkbox:", rows[0]);
                } else {
                  setSelectedRow(null);
                }
              }}

              ></MaterialTable>


                
    <MaterialTable 
    
              size="small"
              title={<div style={{ fontSize: '18px', fontWeight:"bold"}}>Asignar lotes</div>}
              data={dataPo}
              columns={ [{title: 'Lote', field: 'nombreLote',

                initialEditValue: selectedRow?.nombreLote ||loteNoSeleccionadoText,

                 editable: 'never',

                validate: (rowData) => {
                  if((rowData.nombreLote === loteNoSeleccionadoText)){return false}
                  if(rowData.nombreLote?.length > 20){
                    return {
                      isValid: false,
                      helperText: "El límite de la columna es de 20 carácteres"
                  };}
                
                },
                  cellStyle: { fontSize: "10px", width: "auto"  },

                  },
                {title: 'N° de siembra ', field: 'siembraNum', type: "numeric",cellStyle: { fontSize: "10px"},
                render: (rowData) => (rowData.siembraNum === 1 ? 'Primera' : 'Segunda'),

                validate:(row)=>{  if (![1, 2].includes(row.siembraNum)) {
      return { isValid: false, helperText: "Debe seleccionar 'Primera' o 'Segunda'" };
    }
    return true;},

                editComponent: (props) => (
                  <select
                    value={props.value || ""}
                    onChange={(e) => props.onChange(Number(e.target.value))} 
                  >
                    <option value="">Seleccione...</option>
                    <option value="1">Primera</option>
                    <option value="2">Segunda</option>
                  </select>
                ),},

                {title: 'Alias Lote', field: 'aliasLote', validate: (row) => {
                  if((row.aliasLote || "").length === 0){return false}

                  if (dataPo.some(e =>
                    e.siembraNum === row.siembraNum &&
                    e.nombreLote.toLowerCase() === row.nombreLote.toLowerCase() &&
                    e.aliasLote.toLowerCase() === row.aliasLote.toLowerCase()
                )) {return {isValid:false, helperText:"Ya existe un lote con ese Alias"}}

                  if(row.aliasLote?.length > 20){
                    return {
                      isValid: false,
                      helperText: "El límite de la columna es de 20 carácteres"
                  };}
                },
                 cellStyle: { fontSize: "10px"}},

                {title: 'Fecha Transplante', field: 'fechaTrasplante',type:"date",cellStyle: { fontSize: "10px"},
                  editComponent: props => (
                    <input
                      type="date"
                      value={props.value || ''} // Para manejar el valor actual del input
                      onChange={e => props.onChange(e.target.value)}
                      style={{     // Ancho del input
                      padding: '8px',      // Espaciado interno
                      border: '1px solid #ccc',  // Borde gris claro
                      borderRadius: '4px', // Bordes redondeados
                      fontSize: '14px',    // Tamaño del texto
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',  // Sombra ligera para darle profundidad
                      outline: 'none',     // Eliminar el borde azul por defecto al hacer clic
                      margin: '5px 0',  }} // Ajusta el ancho del input aquí
                    />) },

                {title: 'Area', field: 'area',type:"numeric",
                  validate: rowData => {
                    if (!rowData.area) return true;
                    const isDecimal = /^\d*\.?\d+$/.test(rowData.area);
                    return rowData.area && isDecimal  ? true : { isValid: false, helperText: "numeros decimales ejemplo: 12,4" };
                },
                 cellStyle: { fontSize: "10px" }},
                {title: 'Orientacion', field: 'orientacion',type:"string", cellStyle: { fontSize: "10px"}},

                {title: 'Fumig', field: 'fumig', cellStyle: { fontSize: "10px"}},

                {title: 'Tipo plastico', field: 'tipoPlastico', cellStyle: { fontSize: "10px", }},

                {title: 'Densidad', field: 'densidad', type:"numeric",
                  validate: rowData => {
                    if (!rowData.area) return true;
                    const isDecimal = /^\d*\.?\d+$/.test(rowData.area);
                    return rowData.area && isDecimal  ? true : { isValid: false, helperText: "numeros decimales ejemplo: 12,4" };
                },
                 cellStyle: { fontSize: "10px"  }},

                {title: 'Colmenas por Ha', field: 'colmenasPorHa',type:"numeric",
                  validate: rowData => {
                    if (!rowData.area) return true;
                    const isDecimal = /^\d*\.?\d+$/.test(rowData.area);
                    return rowData.area && isDecimal  ? true : { isValid: false, helperText: "numeros decimales ejemplo: 12,4" };
                },
                 cellStyle: { fontSize: "10px" }},

                {title: 'Prog Fertilizacion', field: 'progFertilizacion', cellStyle: { fontSize: "10px"}},
                {title: 'Prog Fitoproteccion', field: 'progFitoProteccion', cellStyle: { fontSize: "10px"}},
                ] || []}


                
              options={{ 
               
                actionsColumnIndex: 0,
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
                 Add: () => 
                  <button
                 onClick={() => {
                  setActivarSelectRow(false);
                 }}
                 className="group cursor-pointer outline-none hover:rotate-90 duration-300"
               >
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   width="30px"
                   height="30px"
                   viewBox="0 0 24 24"
                   className="stroke-green-700 fill-none group-hover:fill-green-100 group-active:stroke-green-200 group-active:fill-green-600 group-active:duration-0 duration-300"
                 >
                   <path
                     d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                     strokeWidth="1.5"
                   ></path>
                   <path d="M8 12H16" strokeWidth="1.5"></path>
                   <path d="M12 16V8" strokeWidth="1.5"></path>
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
                    deleteText: '¿Estás seguro de que deseas eliminar este lote del Programa Operativo?', // Cambia el mensaje de confirmación
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
                onRowAddCancelled: (rowData) => {console.log("Row adding cancelled"), setActivarSelectRow(true);},
                onRowUpdateCancelled: (rowData) => console.log("Row editing cancelled"),
                onRowAdd: (newData)=>{
                setActivarSelectRow(true);
                setSelectedRow(null);
                 return new Promise((resolve, reject) => {

                //resolver errores acá y hacer validaciones y darle formato
                const newDataWithId = {
                  ...newData,
                  temporada:tempActiva[0]?.temporada,
                  nombreLote: selectedRow?.nombreLote ?? "",

                  aliasLote: newData.aliasLote?.toUpperCase() || null,
                  fechaTrasplante: newData.fechaTrasplante?.toUpperCase() || null,
                  area: newData.area?.toUpperCase() || null,
                  orientacion: newData.orientacion?.toUpperCase() || "Norte-Sur",
                  fumig: newData.fumig?.toUpperCase() || null,
                  tipoPlastico: newData.tipoPlastico?.toUpperCase() || null,
                  densidad: newData.densidad?.toUpperCase() || null,
                  colmenasPorHa: newData.colmenasPorHa?.toUpperCase() || null,
                  progFertilizacion: newData.progFertilizacion?.toUpperCase() || null,
                  progFitoProteccion: newData.progFitoProteccion?.toUpperCase() || null,

                }
                
                console.log("newDataWithId: ",newDataWithId);

                lotePoService.create(newDataWithId)
                .then(response => {
                    if (response.success) {
                        console.log("Lote asignado exitosamente");
                        setDataPo(prevDataPo => [ newDataWithId , ...prevDataPo]);
                        showToast('success', 'Lote asignado al Programa Operativo', '#2d800e');
                        resolve();
                    } else {
                        reject(`Error al asignar el lote: ${response.message}`);
                        
                    }
                })
                .catch(error => {
                    reject(`Error de red: ${error.message}`);
                    return
                });
              })
                },

                  onRowUpdate: (newData, oldData) => {},
                  onRowDelete: (oldData) => { 
                            return new Promise((resolve, reject) => {
                              lotePoService.delete(oldData.temporada, oldData.siembraNum,oldData.nombreLote, oldData.aliasLote)
                              .then(response => {
                                  if (response.success) {
                                    const dataDelete = dataPo.filter((el) =>
                                      !(el.siembraNum === oldData.siembraNum &&  el.nombreLote === oldData.nombreLote &&
                                         el.aliasLote ===oldData.aliasLote));
                                      setDataPo(dataDelete);
                                      showToast('success', 'Lote eliminado del Programa Operativo', '#2d800e');
                                      resolve();
                                  } else {
                                   
                                    showToast('error', '`Error al eliminar el lote del Programa Operativo', '#9c1010');
                                      reject('No se pudo eliminar el lote.');
                                  }
                              })
                              .catch(error => {
                                  reject(`Error al eliminar: ${error.message}`);
                              });
                          });
                          },


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
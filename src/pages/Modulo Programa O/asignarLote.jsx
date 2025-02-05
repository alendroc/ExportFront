import styled from "styled-components";
import MaterialTable,  { MTableToolbar }  from "@material-table/core";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import React, { useState, useEffect  } from "react";
import PropTypes from 'prop-types';
import { LoteService } from "../../services/LoteService";
import { LotePOService } from "../../services/LotesPOService";
import { TemporadasService } from "../../services/TemporadasService";
import { showToast } from "../../components/helpers";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, RadioGroup, FormControlLabel, Radio, } from '@mui/material'

var loteService = new LoteService;
var lotePoService = new LotePOService;
var temporadaService= new TemporadasService;
const loteNoSeleccionadoText="Debe seleccionar un lote"

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

function ActionDialog(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose(null);
  };

  const handleOk = async () => {
    if (value === 'Copiar') {
      await navigator.clipboard.writeText("Texto de prueba copiado"); 
      alert('Texto copiado al portapapeles');
    } else if (value === 'Pegar') {
      const textoPegado = await navigator.clipboard.readText();
      alert(`Texto pegado: ${textoPegado}`);
    }
    onClose(value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 300 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Selecciona una temporada</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="acción"
          name="acción"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleOk}>Pegar</Button>
      </DialogActions>
    </Dialog>
  );
}

ActionDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

const columnLote = [{title: 'Lote', field: 'nombreLote', headerStyle:{padding:"0 0 0 5px"},  cellStyle: { fontSize: "10px",padding:"0 0 0 5px", width: "30px"}},
  {title: 'Area', field: 'area', type: "numeric",headerStyle:{padding:"0 8px 0 0", width: "30px"},cellStyle: { fontSize: "10px",padding:"0 8px 0 0",  width: "30px"}},
];



export function AsignarLote() {
   const [data, setData] = useState([]);
   const [dataPo, setDataPo] = useState([]);
   const [tempActiva, setTempActiva] = useState([]);
   const [selectedRow, setSelectedRow] = useState(null);
   const [activarSelectRow, setActivarSelectRow] = useState(true);
   const [open, setOpen] = React.useState(false);
   const [value, setValue] = React.useState('');
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);
  const [widthNpdy, setwidthNpdy] = useState(700);

  //Dialog//
  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };
/////////////

//cargar datos de los services
  const fetchData = async (service, setDta, logName) => {
    try {
      const response = await service();
      //console.log("response", response);
      if (response.success) {
        setDta(response[logName]);
        return response[logName];
        //console.log(logName, response[logName]);
      } else {
        console.log(`No se pudieron obtener los ${logName}.`);
        return null
      }
    } catch (error) {
      setDta([])
      console.error(`Error al obtener los ${logName}:`, error);
      return null;
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

  
  //para los fetch
   useEffect(() => {
     
    fetchData(() => loteService.getLotesActivos(), setData, "lotes");
    fetchData(() => temporadaService.getActual(), setTempActiva, "temporadaActual")
    .then(temp => {
      if (temp && temp.length > 0) {
        return fetchData(() => lotePoService.getByTemporada(temp[0]?.temporada), setDataPo, "LotesPO");
      }
  }).catch(error => console.error("Error en las peticiones:", error));
       }, []);

       //para responsive
    useEffect(()=>{
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
       },[])


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
                    if(activarSelectRow){
                    setSelectedRow((prevRow) => (prevRow?.nombreLote === rowData.nombreLote ? null : 
                      {nombreLote: rowData.nombreLote, 
                        area: rowData.area }));

                        console.log("selectedRow",selectedRow)
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
                height: "100%",
                margin: "0 50px 0 0",
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
                setSelectedRow((prevRow) => (prevRow?.nombreLote === rowData.nombreLote ? null :  {nombreLote: rowData.nombreLote, 
                  area: rowData.area }));
                
              }}
              onSelectionChange={(rows) => {
                if (activarSelectRow && rows.length > 0) {
                  setSelectedRow(rows[0] ? { nombreLote: rows[0].nombreLote, area: rows[0].area } : null);
                  console.log("Fila seleccionada por checkbox:", rows[0]);
                  console.log("selectedRow",selectedRow)
                } else {
                  setSelectedRow(null);
                }
              }}

              ></MaterialTable>


      
    <MaterialTable 
    
              size="small"
              title={<div style={{ fontSize: '15px', fontWeight:"bold"}}>Asignar lotes</div>}
              data={dataPo}
              columns={ [{title: 'Lote', field: 'nombreLote',initialEditValue: selectedRow?.nombreLote ||loteNoSeleccionadoText,editable: 'never',

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
                {title: 'N° de siembra ', field: 'siembraNum', type: "numeric", editable:"onAdd", cellStyle: { fontSize: "10px"},
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

                {title: 'Alias Lote', field: 'aliasLote', editable:"onAdd", validate: (row) => {
                  if((row.aliasLote || "").length === 0){return false}

                //   if (dataPo.some(e =>
                //     e.siembraNum === row.siembraNum &&
                //     e.nombreLote.toLowerCase() === row.nombreLote.toLowerCase() &&
                //     e.aliasLote.toLowerCase() === row.aliasLote.toLowerCase()
                // )) {return {isValid:false, helperText:"Ya existe un lote con ese Alias"}}

                if(row.aliasLote?.trim() ===""){
                  return {
                    isValid: false,
                    helperText: "No se permite el campo vacío"
                };}

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

                    const totalArea = dataPo
                    .filter((item) => item.nombreLote === rowData.nombreLote && item.siembraNum === rowData.siembraNum)
                    .reduce((sum, item) => sum + item.area, 0) + rowData.area;
                  
                  const esValido = selectedRow?.area || data.find((lote)=>lote.nombreLote===rowData.nombreLote).area >= totalArea;
                  

                  console.log(esValido,  selectedRow?.area, totalArea, rowData.area)
                 // if(!esValido){return{ isValid: false, helperText: "excede el limite del area" }}

                    const isDecimal = /^\d*\.?\d+$/.test(rowData.area);
                    return  !esValido?{ isValid: false, helperText: "excede el limite del area" }:
                     rowData.area && isDecimal  ? { isValid: true, helperText: "numeros decimales ejemplo: 12,4" }: false;
                },
                 cellStyle: { fontSize: "10px" }},

                {title: 'Orientacion', field: 'orientacion',type:"string",
                  validate: rowData => {
                    if (!rowData.orientacion) return true;
                    if(rowData.orientacion?.length > 20){
                      return {
                        isValid: false,
                        helperText: "El límite de la columna es de 20 carácteres"
                    };}
                    
                },
                 cellStyle: { fontSize: "10px"}},

                {title: 'Fumig', field: 'fumig', 
                  validate: rowData => {
                  if (!rowData.fumig) return true;
                  if(rowData.fumig?.length > 50){
                    return {
                      isValid: false,
                      helperText: "El límite de la columna es de 50 carácteres"
                  };}
                  
              },cellStyle: { fontSize: "10px"}},

                {title: 'Tipo plastico', field: 'tipoPlastico', 
                  validate: rowData => {
                    if (!rowData.tipoPlastico) return true;
                    if(rowData.tipoPlastico?.length > 50){
                      return {
                        isValid: false,
                        helperText: "El límite de la columna es de 50 carácteres"
                    };}
                    
                },cellStyle: { fontSize: "10px", }},

                {title: 'Densidad', field: 'densidad', type:"numeric",
                  validate: rowData => {
                    if (!rowData.densidad) return true;
                    const isDecimal = /^\d*\.?\d+$/.test(rowData.densidad);
                    return rowData.densidad && isDecimal  ? { isValid: true, helperText: "numeros decimales ejemplo: 12,4" }: false;
                },
                 cellStyle: { fontSize: "10px"  }},

                {title: 'Colmenas por Ha', field: 'colmenasPorHa',type:"numeric",
                  validate: rowData => {
                    if (!rowData.colmenasPorHa) return true;
                    const isDecimal = /^\d*\.?\d+$/.test(rowData.colmenasPorHa);
                    return rowData.colmenasPorHa && isDecimal  ? { isValid: true, helperText: "numeros decimales ejemplo: 12,4" }: false;
                },
                 cellStyle: { fontSize: "10px" }},

                {title: 'Prog Fertilizacion', field: 'progFertilizacion',
                  validate: rowData => {
                    if (!rowData.progFertilizacion) return true;
                    if(rowData.progFertilizacion?.length > 50){
                      return {
                        isValid: false,
                        helperText: "El límite de la columna es de 50 carácteres"
                    };}
                    
                }, cellStyle: { fontSize: "10px"}},

                {title: 'Prog Fitoproteccion', field: 'progFitoProteccion',
                  validate: rowData => {
                    if (!rowData.progFitoProteccion) return true;
                    if(rowData.progFitoProteccion?.length > 50){
                      return {
                        isValid: false,
                        helperText: "El límite de la columna es de 50 carácteres"
                    };}
                    
                }, cellStyle: { fontSize: "10px"}},
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
                <div style={{ 
                  backgroundColor: '#50ad53', 
                  height: '60px', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                }}> 
                  <MTableToolbar style={{padding:'0'}} {...props}></MTableToolbar>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                  <p>Temporada</p>
                  <p>{tempActiva[0]?.temporada ?? "No hay temporada activa"}</p>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', width: '20%', justifyContent: 'space-around' }}>
                  <button  class="button" onClick={handleClickListItem} style={{ cursor: 'pointer' }}>Copiar</button>
                 
                  </div>
                  <ActionDialog open={open} onClose={handleClose} value={value} />
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                   
                  </div>
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
                  
                 return new Promise((resolve, reject) => {

                //resolver errores acá y hacer validaciones y darle formato
                const newDataWithId = {
                  ...newData,
                  temporada:tempActiva[0]?.temporada,
                  nombreLote: selectedRow?.nombreLote ?? "",

                  aliasLote: newData.aliasLote?.toUpperCase() || null,
                  fechaTrasplante: newData.fechaTrasplante || null,
                  area: newData.area || null,
                  orientacion: newData.orientacion?.toUpperCase() || "Norte-Sur",
                  fumig: newData.fumig?.toUpperCase() || null,
                  tipoPlastico: newData.tipoPlastico?.toUpperCase() || null,
                  densidad: newData.densidad || null,
                  colmenasPorHa: newData.colmenasPorHa || null,
                  progFertilizacion: newData.progFertilizacion?.toUpperCase() || null,
                  progFitoProteccion: newData.progFitoProteccion?.toUpperCase() || null,

                }
                
                console.log("newDataWithId: ",newDataWithId);

                const isDuplicate = dataPo.some(e =>
                  e.siembraNum === newData.siembraNum &&
                  e.nombreLote.toLowerCase() === newData.nombreLote.toLowerCase() &&
                  e.aliasLote.toLowerCase() === newData.aliasLote.toLowerCase()
                );
            
                if (isDuplicate) {
                  showToast('error', 'Ya existe un lote con ese Alias', '#9c1010')
                  reject('Error: Ya existe un lote con ese Alias')
                  return
                }

                lotePoService.create(newDataWithId)
                .then(response => {
                  setActivarSelectRow(true);
                  setSelectedRow(null);
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

                  onRowUpdate: (newData, oldData) => {
                     return new Promise((resolve, reject) => {
                                const index = dataPo.findIndex(item => item.nombreLote === oldData.nombreLote && 
                                  item.siembraNum === oldData.siembraNum && item.aliasLote===oldData.aliasLote);

                                const updatedDataPo = [...dataPo];
                    
                                const newDataWithId = {
                                  ...newData,
                                 // descripcion: newData.descripcion && newData.descripcion.trim() !== "" ? newData.descripcion.toUpperCase() : null,
                              }
                              console.log("dataId",newDataWithId)
                              //resolve();
                    
                                const isDuplicate = updatedDataPo.some((loteP, idx) => loteP.nombreLote === newDataWithId.nombreLote && 
                                loteP.siembraNum === newDataWithId.siembraNum &&
                                loteP.aliasLote === newDataWithId.aliasLote &&
                                idx !== index);

                                if (isDuplicate) {
                                    showToast('error', 'Lote ya asignado', '#9c1010');
                                    reject('Error al actualizar el lote, valores duplicados');
                                    return;
                                }
                    
                                updatedDataPo[index] = newDataWithId;

                                lotePoService.update(oldData.temporada,oldData.siembraNum,oldData.nombreLote,oldData.aliasLote, newDataWithId) // Asumiendo que `oldData` tiene un campo `id`
                                .then(response => {
                                        console.log("test")
                                          if (response.success) {
                                              setDataPo(updatedDataPo);
                                              showToast('success', 'Lote actualizado', '#2d800e');
                                              resolve();
                                          } else {
                                              reject(`Error al actualizar el lote: ${response.message}`);
                                              showToast('error', '`Error al actualizar el lote', '#9c1010');
                                          }
                                      })
                                      .catch(error => {
                                          reject(`Error de red: ${error.message}`);
                                      });
                                 })
                  },
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
flex-wrap: wrap;

 .Tablas{
  display: flex;
 }
.temporada{
  display: inline-block;
}

  .custom-toolbar .MuiToolbar-root {
    padding: 0 10px 0 0!important; 
  }

  .MuiToolbar-root .MuiInputBase-root input::placeholder {
  color: #000000; /* Reemplaza con el color deseado */
  }
  .MuiSvgIcon-root .MuiSvgIcon-fontSizeSmall .css-120dh41-MuiSvgIcon-root{
    display: none !important;
  }
  .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular.css-ig9rso-MuiToolbar-root{
    padding-right: 0;
    width: 45%;
  }
  .MuiBox-root.css-p9qzma {
  /* Tus estilos personalizados aquí */
  position: absolute;
    left: -55px;
    border-radius: 10px;
    top: 70px;
}

@media (max-width: 1200px) {
    .MuiBox-root.css-p9qzma {
      top: -90px; /* Baja un poco */
      left: 180px;
    }
  }
.button {
  display: inline-block;
  padding: 6px 10px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: #ffffff;
  background-color: #e59c27;
  border: none;
  border-radius: 50px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.button:hover {
  background-color: #23ca06;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(170, 170, 170, 0.729);
}

.button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.3);
}

.button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button::before {
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  z-index: -1;
  transition: all 0.3s ease-in-out;
}

.button:hover::before {
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
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
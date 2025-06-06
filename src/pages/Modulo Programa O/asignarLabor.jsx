import styled from "styled-components";
import * as React from 'react';
import List from '@mui/material/List';
import { Tooltip} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useState } from "react";
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import { LaboresService } from "../../services/LaboresService";
import { LaboresTService } from "../../services/LaboresTService";
import { TemporadasService } from "../../services/TemporadasService";
import { Utils } from '../../models/Utils';
import { showToast } from "../../components/helpers";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import {ActionDialog, activacionDialog} from '../../components/copiar'

var laboresService = new LaboresService;
var laboresTService = new LaboresTService;
var temporadaService = new TemporadasService;

export function AsignarLabor() {
  const { open, handleClickListItem, handleClose } = activacionDialog();
  const [labores, setLabores] = useState([]);
  const [data, setData] = useState([]);
  const [tempActiva, setTempActiva] = useState([]);
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);
  const [widthNpdy, setwidthNpdy] = useState(700);
  const [font, setFont] = useState(700);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [departamentoLabor, setDepartamentoLabor] = useState([]);

  const [isAddEnabled, setIsAddEnabled] = useState(false);

  React.useEffect(() => {
    Utils.fetchData(temporadaService.getActual(), setTempActiva, "temporadaActual")
    Utils.fetchData(laboresService.getAll(), setLabores, "labores");
  }, []); // Ejecuta el efecto cuando cambia la selección
  React.useEffect(() => {
    if (departamentoLabor.length > 0 && tempActiva.length > 0) {
      Utils.fetchData(
        laboresTService.getByDepartamento(tempActiva[0]?.temporada, departamentoLabor[0], departamentoLabor[1]),
        setData,
        "laboresTemporada"
      );
    }
  }, [departamentoLabor, tempActiva]);

  //modificar tamaño
  const handleResize = () => {
    if (window.innerWidth < 1300) {
      setMaxBodyHeight(470);
      setwidthNpdy("61vw");
    } else if (window.innerWidth < 2000) {
      setMaxBodyHeight(580);
      setwidthNpdy("63vw");
    } else {
      setMaxBodyHeight(480);
      setwidthNpdy("60vw");
    }
  };

  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])




  const laboresPorDepartamento = labores.reduce((acc, labor) => {
    if (!acc[labor.departamento]) {
      acc[labor.departamento] = [];
    }
    acc[labor.departamento].push(labor);
    return acc;
  }, {});

  const seccionLista = (event, departamento, index, labor) => {
    setSelectedIndex(`${departamento}-${index}`)
    setDepartamentoLabor([departamento, labor])
    setIsAddEnabled(true); // Habilitamos el botón de agregar
  }

  const columnLabores =
    [{
      title: 'Temporada', field: 'temporada', initialEditValue: tempActiva[0]?.temporada, editable: 'never',
    },
    {
      title: 'N° Siembra', field: 'siembraNumero', type: "numeric",editable: 'onAdd',
      render: (rowData) => (rowData.siembraNumero === 1 ? '1' : '2'),
      validate: (row) => {
        if (![1, 2].includes(row.siembraNumero)) {
          return { isValid: false, helperText: "Debe seleccionar '1' o '2'" };
        }
        return true;
      },
      editComponent: (props) => (
        <select
          value={props.value || ""}
          onChange={(e) => props.onChange(Number(e.target.value))}
        >
          <option value="">Seleccione...</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      ),

    },
    {
      title: 'Departamento', field: 'departamento', initialEditValue: departamentoLabor[0], editable: 'never',
     validate: (rowData) => {
        if (rowData.departamento?.length > 50) {
          return {
            isValid: false,
            helperText: "El límite de la columna es de 50 carácteres"
          };
        }
      }
    },
    {
      title: 'Labor', field: 'labor', initialEditValue: departamentoLabor[1], editable: 'never',
      validate: (rowData) => {
        if (rowData.labor?.length > 50) {
          return {
            isValid: false,
            helperText: "El límite de la columna es de 50 carácteres"
          };
        }
      }
    },
    {
      title: 'Alias Labor', field: 'aliasLabor',editable: 'onAdd',
      validate: (rowData) => {
        if ((rowData.aliasLabor || "").length === 0) { return false }
        if (rowData.aliasLabor?.trim() === "") {
          return {
            isValid: false,
            helperText: "No se permite el campo vacío"
          };
        }
        if (rowData.aliasLabor?.length > 50) {
          return {
            isValid: false,
            helperText: "El límite de la columna es de 50 carácteres"
          };
        }
      }
    },
    { title: 'Aplicar a todo', field: 'aplicarATodo', type: "boolean", },
    {
      title: 'Aplicar a', field: 'aplicarA',
      validate: (rowData) => {
        if (rowData.aplicarA?.length > 50) {
          return {
            isValid: false,
            helperText: "El límite de la columna es de 50 carácteres"
          };
        }
      }
    }]

  return (
    <Container>
      <div className="group relative h-12 mb-3 w-1/6 p-2 bg-slate-300 rounded-md overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-lime-300 transition-all duration-500 scale-x-0 origin-left group-hover:scale-x-100"></div>
        <span className="absolute inset-0 text-center text-sm flex items-center justify-center text-slate-900">
          Temporada: {tempActiva[0]?.temporada ?? "No hay temporada activa"}
        </span>
      </div>
      <div className="flex gap-2">
        <List
          sx={{
            width: '100%',
            maxWidth: 180,
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            height: 'fit-content',
            maxHeight: 300,
            '& ul': { padding: 0 },
            boxShadow: selectedIndex
            ? '0px 4px 12px rgba(0, 0, 0, 0.211)' // Sombra fija cuando hay algo seleccionado
            : '0px 4px 12px rgba(0, 0, 0, 0.336)', // Sombra inicial
          animation: selectedIndex ? 'none' : 'parpadeo 1.5s infinite',
          '@keyframes parpadeo': {
            '0%': { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.211)' },
            '50%': { boxShadow: '0px 4px 12px rgba(255, 85, 0, 0.4)' }, // Cambia el color o intensidad
            '100%': { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.211)' },
          },
          }}
          className=" rounded-lg"
          subheader={<li />}
        >
          {Object.entries(laboresPorDepartamento).map(([departamento, labores]) => (
            <li key={`section-${departamento}`}>
              <ul>
                <ListSubheader
                    sx={{
                      backgroundColor: '#ea9875', // Color de fondo del subheader
                      color: 'white', // Color del texto
                      fontWeight: 'bold',
                      lineHeight: '2.6',
                      fontSize: '12px',
                    }} >{departamento}</ListSubheader>
                {labores.map((labor, index) => (
                  <ListItemButton key={`item-${departamento}-${index}`}
                    selected={selectedIndex === `${departamento}-${index}`} // Compara con el seleccionado
                    onClick={(event) => seccionLista(event, departamento, index, labor.labor)}
                  >
                    <ListItemText secondary={labor.labor} />
                  </ListItemButton>
                ))}
              </ul>
            </li>
          ))}
        </List>

        <MaterialTable
          size="small"
          data={data || []}
          title={<div style={{ fontSize: '16px' }}>Asignar labores de temporada</div>}
          columns={columnLabores}
          options={{
            
            addRowPosition: "first",
            maxBodyHeight: maxBodyHeight,
            paging: false,
            overflowX: "auto",
            padding: "dense",
            paging: false,
            headerStyle: {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: '#ffffff',
            },
            searchFieldStyle: {
              fontSize: "14px",
              width: "120px",
              padding: "0",
            },
          }}
          style={{ width: widthNpdy, maxWidth: "1000px" }}
          icons={{
            Add: () => <AddBox style={{ fontSize: "25px", color: "white" }} />, // Cambia el tamaño del ícono de agregar
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
                padding: '0 1rem',
              }}>
                <MTableToolbar className={"w-[95%]"} {...props} />
                <div className={`${isAddEnabled ? 'block' : 'hidden'}`}>
                {Utils.getTempActive() && (
                  <Tooltip title="Copiar" placement="top-start" arrow>
                    <button 
                      className="cursor-pointer hover:animate-scale-loop p-2 transition-all duration-300 hover:text-slate-800"
                      onClick={handleClickListItem}
                    >
                      <FileCopyIcon 
                        style={{ fontSize: '20px' }} 
                        className="transition-all drop-shadow-md hover:drop-shadow-xl duration-300"
                      />
                    </button>
                  </Tooltip>
                )}
          
                <ActionDialog 
                  open={open} 
                  onClose={handleClose} 
                  data={data} 
                  service={laboresTService}  
                /></div>
              </div>
            ),
          }}
          localization={{
            body: {
              emptyDataSourceMessage: 'Seleccione un labor e ingrese los datos', // Mensaje de datos vacíos en la tabla
              editRow: {
                deleteText: '¿Estás seguro de que deseas eliminar este labor?', // Cambia el mensaje de confirmación
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
            onRowAdd: isAddEnabled
              ? (newData) =>
                new Promise((resolve, reject) => {
                  const newDataWithId = {
                    
                    ...newData,
                    temporada: tempActiva[0]?.temporada,
                    departamento: departamentoLabor[0],
                    labor: departamentoLabor[1],
                    siembraNumero: newData.siembraNumero || 1,
                    aliasLabor: newData.aliasLabor?.toUpperCase() || null,
                    aplicarATodo: newData.aplicarATodo || false,
                    aplicarA: newData.aplicarA?.toUpperCase() || null,
                  
                  }
                  console.log("newDataWithId: ",newDataWithId);

                  const isDuplicate = data.some(e =>
                    e.siembraNumero === newDataWithId.siembraNumero &&
                    e.temporada === newDataWithId.temporada &&
                    e.departamento === newDataWithId.departamento &&
                    e.labor === newDataWithId.labor &&
                    e.aliasLabor?.toLowerCase() === newDataWithId.aliasLabor?.toLowerCase()
                  );
                  if (isDuplicate) {
                   showToast('error', 'Ya existe un labor con ese Alias', '#9c1010')
                   reject('Error: Ya existe un labor con ese Alias')
                   return
                 }
                  laboresTService.create(newDataWithId)
                  .then( response => {
                    if (response.success) {
                      console.log("Lote asignado exitosamente");
                      setData(prevData => [ newDataWithId , ...prevData]);
                      showToast('success', 'Labor agregado correctamente', '#107c10')
                      resolve();
                    }else{
                      reject(`Error al asignar el labor: ${response.message}`);
                    }
                  }).catch(error => {
                    reject(`Error de red: ${error.message}`);
                });
              })
              : undefined,
              onRowUpdate: (newData, oldData) => {
                return new Promise((resolve, reject) => {
                  const index = data.findIndex(item => item.departamento === oldData.departamento && 
                    item.siembraNumero === oldData.siembraNumero && item.temporada===oldData.temporada
                    && oldData.aliasLabor?.toLowerCase() === item.aliasLabor?.toLowerCase()
                  && item.labor === oldData.labor);

                  const updatedDataT = [...data];

                  const newDataWithId = {
                    ...newData,
                   // descripcion: newData.descripcion && newData.descripcion.trim() !== "" ? newData.descripcion.toUpperCase() : null,
                }
                console.log("dataId")
               
                 const isDuplicate = updatedDataT.some((e, idx) => 
                    e.siembraNumero === newDataWithId.siembraNumero &&
                    e.temporada === newDataWithId.temporada &&
                    e.departamento === newDataWithId.departamento &&
                    e.labor === newDataWithId.labor &&
                    e.aliasLabor?.toLowerCase() === newDataWithId.aliasLabor?.toLowerCase() &&
                  idx !== index);
                 
                  if (isDuplicate) {
                    showToast('error', 'Labor ya asignado', '#9c1010');
                    reject('Error al actualizar el Labor, valores duplicados');
                    return;
                }
           
                updatedDataT[index] = newDataWithId;
              
                laboresTService.update(oldData.temporada,oldData.departamento,oldData.siembraNumero,oldData.labor, oldData.aliasLabor,newDataWithId)
                .then(response =>{
                  console.log("test")
                  if (response.success) {
                      setData(updatedDataT);
                      showToast('success', 'Labor actualizado', '#2d800e');
                      resolve();
                  } else {
                      reject(`Error al actualizar el Labor: ${response.message}`);
                      showToast('error', '`Error al actualizar el Labor', '#9c1010');
                  }
              })
              .catch(error => {
                  reject(`Error de red: ${error.message}`);
              });
                })  
              },
              onRowDelete: (oldData) => {
                return new Promise((resolve, reject) => {
                  try{
                  laboresTService.delete(oldData.temporada, oldData.departamento, oldData.labor, oldData.siembraNumero, oldData.aliasLabor)
                  .then(response => {
                    if (response.success) {
                      const dataDelete = data.filter((el) =>
                      !(el.temporada === oldData.temporada && el.departamento === oldData.departamento
                        && el.labor === oldData.labor  &&
                        el.siembraNumero === oldData.siembraNumero && el.aliasLabor === oldData.aliasLabor));
                        setData(dataDelete);
                          showToast('success', 'Labor eliminado del Programa Operativo', '#2d800e');
                          resolve();
                     } else{     
                     showToast('error', '`Error al eliminar el labor del Programa Operativo', '#9c1010');
                     reject('No se pudo eliminar el labor.');
                     }
                  }).catch(error => {
                    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
                    showToast('error', `Error al eliminar: ${errorMessage}`, '#9c1010');
                    reject(errorMessage);
                });
              }catch(error){
                 showToast('error', error, '#9c1010')
                resolve()
              }
            });
           }
          }}>

        </MaterialTable>
      </div>


    </Container>);
}
const Container = styled.div`
  gap: 10px;
 .css-1a1whku-MuiTypography-root{
    font-size: 12px;
    color: black;
    font-family: 'popins', sans-serif;
 }

 .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular.css-ig9rso-MuiToolbar-root{
    padding-right: 0;
  }

 @media (min-width: 700px){
    .MuiTableCell-root {
      padding: 4px 8px;
     font-size: 9px !important;
   }
   .css-1a1whku-MuiTypography-root{
    font-size: 10px;
    color: black;
    font-family: 'popins', sans-serif;
 }
 .css-l328gy-MuiListSubheader-root{
  font-size: 14px;
 }
  }
 
 @media (min-width: 1200px){
    max-width: 1400px;
    .MuiTableCell-root {
      padding: 4px 8px;
     font-size: 12px !important;
   }
   .css-1a1whku-MuiTypography-root{
    font-size: 12px;
    color: black;
    font-family: 'popins', sans-serif;
 }
 .css-l328gy-MuiListSubheader-root{
  font-size: 14px;
 }
  }
  @media (min-width: 1600px) {
 max-width: 1400px;
 .MuiTypography-h6 {
   font-size: 20px; 
 }
 .MuiTableCell-root {
     padding: 4px 8px; 
     font-size: 16px !important;
   }
 


  }
  `
import styled from "styled-components";
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useState } from "react";
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import { LaboresService } from "../../services/LaboresService";
import { LaboresTService } from "../../services/LaboresTService";
import { TemporadasService } from "../../services/TemporadasService";
import {Utils} from '../../models/Utils';
import MaterialTable,  { MTableToolbar }  from "@material-table/core";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';

var laboresService = new LaboresService;
var laboresTService = new LaboresTService;
var temporadaService = new TemporadasService;

export function AsignarLabor() {
  const [labores, setLabores] = useState([]);
  const [data, setData] = useState([]);
  const [tempActiva, setTempActiva] = useState([]);
  const [maxBodyHeight, setMaxBodyHeight] = useState(480); 
  const [widthNpdy, setwidthNpdy] = useState(700);
  const [font, setFont] = useState(700);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [departamentoLabor, setDepartamentoLabor] = useState([]);

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

   React.useEffect(()=>{
          handleResize();
          window.addEventListener("resize", handleResize);
          return () => window.removeEventListener("resize", handleResize);
         },[])
  



  const laboresPorDepartamento = labores.reduce((acc, labor) => {
    if (!acc[labor.departamento]) {
      acc[labor.departamento] = [];
    }
    acc[labor.departamento].push(labor);
    return acc;
  }, {});

  const seccionLista = (event, departamento, index, labor) =>{
    setSelectedIndex(`${departamento}-${index}`) 
    setDepartamentoLabor([departamento, labor])
  }

  const columnLabores = 
  [{ title: 'Temporada', field: 'temporada', initialEditValue: tempActiva[0]?.temporada, editable: 'never',
    validate: (rowData) => {
     
      if(rowData.temporada?.length > 10){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 10 carácteres"
      };}
    },
   },
  { title: 'N° Siembra', field: 'siembraNumero', type: "numeric", editable:"onAdd",editable:"onAdd",
    render: (rowData) => (rowData.siembraNum === 1 ? '1' : '2'),
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
    ),
    
  },
  { title: 'Departamento', field: 'departamento', initialEditValue: departamentoLabor[0], editable: 'never',
    validate: (rowData) => {
      if(rowData.departamento?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"
      };}
    }
   },
  { title: 'Labor', field: 'labor', initialEditValue: departamentoLabor[1], editable: 'never',
    validate: (rowData) => {
      if(rowData.labor?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"
      };}
    }
   },
  { title: 'Alias Labor', field: 'aliasLabor',editable:"onAdd",
    validate: (rowData) => {
      if((rowData.aliasLabor || "").length === 0){return false}
      if(rowData.aliasLabor?.trim() ===""){
        return {
          isValid: false,
          helperText: "No se permite el campo vacío"
      };}
      if(rowData.aliasLabor?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"
      };}
    }
  },
  { title: 'Aplicar a todo', field: 'aplicarATodo',editable:"onAdd", },
  { title: 'Aplicar a', field: 'aplicarA',editable:"onAdd",
    validate: (rowData) => {
      if(rowData.aplicarA?.length > 50){
        return {
          isValid: false,
          helperText: "El límite de la columna es de 50 carácteres"
      };}
    }
  }]
                       
    return (
  <Container>
  <div className="group relative w-32 h-12 mb-3 p-2 bg-slate-300 rounded-md overflow-hidden shadow-sm">
  <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-lime-300 transition-all duration-500 scale-x-0 origin-left group-hover:scale-x-100"></div>
  <span className="absolute inset-0 text-center text-sm flex items-center justify-center text-slate-900 z-10">
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
        fontSize: '9px',
        maxHeight: 300,
        '& ul': { padding: 0 },
      }}
      className="shadow-lg rounded-lg"
      subheader={<li />}
    >
     {Object.entries(laboresPorDepartamento).map(([departamento, labores]) => (
        <li key={`section-${departamento}`}>
          <ul>
          <ListSubheader>{departamento}</ListSubheader>
          {labores.map((labor, index) => (
                <ListItemButton  key={`item-${departamento}-${index}`}
                selected={selectedIndex === `${departamento}-${index}`} // Compara con el seleccionado
                onClick={(event) => seccionLista(event, departamento, index,labor.labor)}
               >
                  <ListItemText secondary={labor.labor}/>
                </ListItemButton>
              ))}
          </ul>
        </li>
      ))}
    </List>

    <MaterialTable
     size="small"
     data={data || []}
     title={<div style={{ fontSize: '16px'}}>Asignar labores de temporada</div>}
     columns={columnLabores || []}
     options={{
               actionsColumnIndex: -1,
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
                         
                             }}>
                               <MTableToolbar style={{ padding: '0' }} {...props}></MTableToolbar>
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
                onRowAdd: (newData) =>{}
             }}>
           
    </MaterialTable>
    </div>

 
    </Container>);
  }
  const Container =styled.div`

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
     font-size: 12px !important;
   }
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
   font-size: 20px; 
 }
 .MuiTableCell-root {
     padding: 4px 8px; 
     font-size: 16px !important;
   }
   .css-1a1whku-MuiTypography-root{
    font-size: 16px;
   }
  }
  `
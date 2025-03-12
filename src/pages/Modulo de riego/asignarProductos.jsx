import styled from "styled-components";
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { BsCaretDownFill } from "react-icons/bs";
import MaterialTable,  { MTableToolbar } from "@material-table/core";
import React, { useState, useEffect } from "react";

export function AsignarProducto() {
     const [data, setData] = useState([]);
     const [dataProductos, setDataProductos] = useState([]);
      const columns = [
         { title: 'DDTS', field: 'ddt', cellStyle: {fontSize: '12px' } },
         { title: 'N° Siembra', field: 'siembraNumero'},
    ]
    const CustomToolbar = (props) => (
        <div style={{ backgroundColor: '#408730', padding: '0' }}>
            <MTableToolbar style={{padding:'0', height: '20px'}} {...props} />
        </div>
    );
    return (
        <Container>
            <div className="w-min">
            <div className="flex justify-between bg-white  p-2 rounded-md gap-11 text-sm shadow-sm mb-3">
              <h3>Temporada</h3>
              <h3>Departamento</h3>
            </div>
            <div className="flex  rounded-sm gap-11 text-sm mb-3">
            <Select
      placeholder="Seleccione un labor"
      indicator={<BsCaretDownFill />}
      sx={{
        
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)',
          },
        },
      }}
    >
      <Option value="cat">Riego y drenaje</Option>
      <Option value="fish">Fish</Option>
      <Option value="bird">Bird</Option>
    </Select>

    <Select
      placeholder="# Siembra"
      indicator={<BsCaretDownFill />}
      sx={{
       width: '8rem',
       
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)',
          },
        },
      }}
    >
      <Option value="dog">TODAS</Option>
      <Option value="cat">Primera</Option>
      <Option value="fish">Segunda</Option>
      
    </Select>
       </div>
       <MaterialTable
     data={data || []}
     columns={columns}
     style={{ width: '' }}
     options={{
        rowStyle: rowData => ({
            backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
          }),
        actionsColumnIndex: -1,
        paging: false,
        toolbar: false,
        search: false,
        headerStyle: { position: 'sticky', top: 0,fontSize: '12px', backgroundColor: '#408730', color: 'white' },
    }}/>
    </div>
    <MaterialTable
     data={dataProductos || []}
     title={<div style={{ fontSize: '12px', color: 'white' }}>Productos</div>}
     columns={[{title: 'ID', field: 'idProducto' },
     {title: 'Producto', field: 'nombreDescriptivo' },
     {title: 'Tipo', field: 'tipoUso' }]}
     options={{
        rowStyle: rowData => ({
            backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
          }),
        actionsColumnIndex: -1,
        paging: false,
        toolbar: true,
        search: false,
        headerStyle: { position: 'sticky', top: 0, fontSize: '12px'},
      
    }}
    style={{ width: "25rem", maxWidth: "600px" }}
    components={{
        Toolbar:CustomToolbar,
    }}/>
    </Container>
    
    );
 }
 const Container = styled.div`
 display: flex;
 flex-direction: column;
 gap: 20px;
 .css-ig9rso-MuiToolbar-root{
    padding: 10px;
    min-height: 0;
 }
 `;
import styled from "styled-components";
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { BsCaretDownFill } from "react-icons/bs";
import MaterialTable,  { MTableToolbar } from "@material-table/core";
import React, { useState, useEffect } from "react";
import { Utils } from "../../models/Utils";
import { ProductoService } from "../../services/ProductoService";
import { DDTLaboresService } from "../../services/DDTLaboresService";

var productoService= new ProductoService();
var ddtLaboresService= new DDTLaboresService();

export function AsignarProducto() {
    const [data, setData] = useState([]);
    const [dataCopy, setDataCopy] = useState([]);
    const [dataProductos, setDataProductos] = useState([]);
    const [labores, setLabores] = useState([]);
    const [selectedLabor, setSelectedLabor] = useState([]);
    const [selectedSiembra, setSelectedSiembra] = useState([]);
    const [desactivarSiembra, setDesactivarSiembra] = useState(true);

      const columns = [
         { title: 'DDTS', field: 'ddt', cellStyle: {fontSize: '12px' } },
         { title: 'N° Siembra', field: 'siembraNumero'},
    ]

    useEffect(() => {
       Utils.fetchData(productoService.getIdNameType(), setDataProductos, "productos")

       Utils.fetchData(ddtLaboresService.getLaboresByDepartamento(Utils.getTempActive() ?? ""), setLabores, "ddtLabores")
      }, []);


      useEffect(() => {
        if((selectedLabor ?? []).length > 0){
console.log("disparador")

            Utils.fetchData(ddtLaboresService.getByTemporadaLaborDepartRiego(Utils.getTempActive() ?? "",selectedLabor),
             setData, "ddtLabores").then((resp)=>{
              setDataCopy(resp)
              setDesactivarSiembra(false);});
              setSelectedSiembra("");
        }else{
          setSelectedSiembra("");
          setDesactivarSiembra(true);}
      }, [selectedLabor]);

      useEffect(() => {
        if(selectedSiembra === ""){
          setData(dataCopy);}
        else{
          const dataFiltered= dataCopy?.filter(d=>d.siembraNumero==selectedSiembra);
          setData(dataFiltered);
        }
      }, [selectedSiembra]);


    const CustomToolbar = (props) => (
        <div style={{ backgroundColor: '#408730', padding: '0' }}>
            <MTableToolbar style={{padding:'0', height: '20px'}} {...props} />
        </div>
    );
    return (
        <Container>
            <div className="w-min">
            <div className="flex justify-between bg-white  p-2 rounded-md gap-11 text-sm shadow-sm mb-3">
              <h3>
                <p>Temporada:</p>
                <p>{sessionStorage.getItem("temporadaActiva") ?? "No hay temporada activa"}</p></h3>
              <h3>
                <p>Departamento:</p>
                <p>RIEGO Y DRENAJE</p>
              </h3>
            </div>
            <div className="flex  rounded-sm gap-11 text-sm mb-3">
      
      <Select
      placeholder="Seleccione un labor"
      indicator={<BsCaretDownFill />}
      value={selectedLabor}
      onChange={(event, newValue) => setSelectedLabor(newValue)}
      sx={{
        
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)',
          },
        },
      }}
    >
     
       {labores?.map((labor,index) => (
              <Option key={index} value={labor.labor}>
                {labor.labor}
              </Option>
            ))}
    </Select>

    <Select
      placeholder="# Siembra"
      indicator={<BsCaretDownFill />}
      value={selectedSiembra}
      onChange={(event, newValue) => setSelectedSiembra(newValue)}
      disabled={desactivarSiembra}
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
      <Option value="">TODAS</Option>
      <Option value="1">Primera</Option>
      <Option value="2">Segunda</Option>

    </Select>
       </div>
       <MaterialTable
     data={data || []}
     columns={columns}
     style={{ width: '' }}
     options={{
        // rowStyle: rowData => ({
        //     backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
        //   }),
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
        // rowStyle: rowData => ({
        //     backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
        //   }),
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
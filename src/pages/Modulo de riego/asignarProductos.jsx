import styled from "styled-components";
import Select, { selectClasses } from '@mui/joy/Select';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Option from '@mui/joy/Option';
import { BsCaretDownFill } from "react-icons/bs";
import { BsCaretRightFill } from "react-icons/bs";
import MaterialTable,  { MTableToolbar } from "@material-table/core";
import React, { useState, useEffect } from "react";
import { Utils } from "../../models/Utils";
import Button from '@mui/joy/Button';
import { ProductoService } from "../../services/ProductoService";
import { DDTLaboresService } from "../../services/DDTLaboresService";
import { TemporadasService } from "../../services/TemporadasService";

var productoService= new ProductoService();
var ddtLaboresService= new DDTLaboresService();
var temporadaService= new TemporadasService();

export function AsignarProducto() {
    const [data, setData] = useState([]);
    const [dataCopy, setDataCopy] = useState([]);
    const [maxBodyHeight, setMaxBodyHeight] = useState(300);
    const [dataProductos, setDataProductos] = useState([]);
    const [dataProductosAsignados, setDataProductosAsignados] = useState([]);
    const [labores, setLabores] = useState([]);
    const [selectedLabor, setSelectedLabor] = useState([]);
    const [selectedSiembra, setSelectedSiembra] = useState([]);
    const [desactivarSiembra, setDesactivarSiembra] = useState(true);
    const [selectedDdt, setSelectedDdt] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);

    const inputRef = React.useRef(null);
      const columns = [
         { title: 'DDTS', field: 'ddt', cellStyle: {fontSize: '12px', padding: '4px 0 4px 9px' } },
         { title: 'N° Siembra', field: 'siembraNumero', cellStyle: {fontSize: '12px', padding: '4px 0 4px 9px'  }},
    ]

    useEffect(() => {
      const tempGuardada = Utils.getTempActive()
          if (tempGuardada) {
            Utils.fetchData(productoService.getIdNameType(), setDataProductos, "productos")
            Utils.fetchData(ddtLaboresService.getLaboresByDepartamento(tempGuardada), setLabores, "ddtLabores")
          } else {
              Utils.fetchData(temporadaService.getActual(), null, "temporadaActual")
              .then(temp => {
                 if (temp && temp.length > 0) {
                    const nuevaTemporada = temp[0]?.temporada??null;
                    Utils.setTempActive(nuevaTemporada)
                
                    nuevaTemporada?Utils.fetchData(productoService.getIdNameType(), setDataProductos, "productos"):null
                    return Utils.fetchData(ddtLaboresService.getLaboresByDepartamento(nuevaTemporada), setLabores, "ddtLabores");
                 }
                //  Utils.fetchData(productoService.getIdNameType(), setDataProductos, "productos")
                //  Utils.fetchData(ddtLaboresService.getLaboresByDepartamento(Utils.getTempActive() ?? ""), setLabores, "ddtLabores")
              })
            }
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

      const getFontSize = () => {
        if (window.devicePixelRatio >= 2) {
          return '10px';
        }
        return '13px';
      };

      const handleResize = () => {
        if (window.innerWidth < 1300) {
          setMaxBodyHeight(470);
          
        } else if (window.innerWidth < 2000) {
          setMaxBodyHeight(580);
        
        } else {
          setMaxBodyHeight(480);
        
        }
      };
    const CustomToolbar = (props) => (
        <div style={{ backgroundColor: '#408730', padding: '0' }}>
            <MTableToolbar style={{padding:'0', height: '20px'}} {...props} />
        </div>
    );
    return (
   <Container>
  <div >
  <div className="mb-3">
    <div style={{width: "25rem", maxWidth: "600px"}}>
    <div className="flex justify-between bg-white  p-2 rounded-md gap-7 text-xs shadow-sm mb-3">
      <h3>
        <p>Temporada:</p>
        <p>{sessionStorage.getItem("temporadaActiva") ?? "No hay temporada activa"}</p></h3>
      <h3>
        <p>Departamento:</p>
        <p>RIEGO Y DRENAJE</p>
      </h3>
    </div>
    <div className="flex  rounded-sm gap-7 text-sm mb-3">
      
      <Select
      placeholder="Seleccione un labor"
      indicator={<BsCaretDownFill />}
      value={selectedLabor}
      onChange={(event, newValue) => setSelectedLabor(newValue)}
      sx={{
        fontSize: '14px',
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
      variant={desactivarSiembra ? "solid" : "outlined"}
      sx={{
       width: '8rem',
       fontSize: '14px',
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
     style={{ 
      }}
     options={{
        // rowStyle: rowData => ({
        //     backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
        //   }),
        maxBodyHeight: '12rem',
        actionsColumnIndex: -1,
        paging: false,
        toolbar: false,
        search: false,
        cellStyle: {fontSize: getFontSize(), padding: '4px 0 4px 9px' },
        headerStyle: { position: 'sticky', top: 0,fontSize: getFontSize(), backgroundColor: '#408730', color: 'white' },
    }}/>
    </div>
   
  </div >
    <section  className="mb-3">
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
        maxBodyHeight: maxBodyHeight,
        actionsColumnIndex: -1,
        paging: false,
        toolbar: true,
        search: true,
        headerStyle: { position: 'sticky', top: 0, fontSize: getFontSize(), backgroundColor: '#ffffff'},
        cellStyle: {fontSize: getFontSize(), padding: '4px 0 4px 9px' }
    }}
    style={{ width: "25rem", maxWidth: "600px" }}
    components={{
        Toolbar:CustomToolbar,
    }}/>
    </section>
    <div className="flex gap-3 bg-white p-2 rounded-md w-min shadow-sm items-end">
  {['Horas Agua', 'Horas Inyeccion', 'Horas Lavado'].map((label, index) => (
    <div key={index} className="flex flex-col items-start">
      <label htmlFor={`input-${index}`} className="text-[11px] font-medium mb-1">
        {label}
      </label>
      <Input
        id={`input-${index}`}
        type="number"
        defaultValue={0}
        sx={{
          fontSize: '14px',
          width: 90,
          height: 12,
        }}
        slotProps={{
          input: {
            ref: inputRef,
            min: 0,
            step: 0.5,
          },
        }}
      />
    </div>
  ))}
   <Button endDecorator={<BsCaretRightFill/>} color="success"
   sx={{fontSize: '12px', padding: '20px 10px', height: '2rem'}}>
        Asignar Producto
      </Button>
</div>
</div>
<div>
    <MaterialTable
     data={dataProductosAsignados || []}
     title={<div style={{ fontSize: '12px', color: 'white' }}> Productos asignados</div>}
     columns={[{title: 'Nombre del producto', field: 'NombreDescriptivo', headerStyle: {width:"30%"}},
     {title: 'Dosis/Ha', field: 'DosisHa', },
     {title: 'Horas Agua', field: 'HorasAgua' },
     {title: 'Horas Inyeccion', field: 'HorasInyeccion' },
     {title: 'Horas Lavado', field: 'HorasLavado' }]}
     options={{
        // rowStyle: rowData => ({
        //     backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
        //   }),
        maxBodyHeight: maxBodyHeight,
        actionsColumnIndex: -1,
        paging: false,
        toolbar: true,
        search: true,
        headerStyle: {
          position: 'sticky',
          padding: '0 0 0 5px',
          top: 0,
          fontSize: getFontSize(),
          backgroundColor: '#ffffff',
        },
        cellStyle: {fontSize: '12px', padding: '4px 0 4px 9px' }
    }}
  
    components={{
        Toolbar:CustomToolbar,
    }}/>
    </div>
    </Container>
    
    );
 }
 const Container = styled.div`
 display: flex;

 gap: 20px;
 .css-ig9rso-MuiToolbar-root{
    padding: 10px;
    min-height: 0;
 }
 `;

import styled from "styled-components";
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import { Height } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { BiSearchAlt, BiInfoCircle, BiSolidDetail, BiChevronsRight, BiChevronRight } from "react-icons/bi";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import React, { use, useEffect, useState } from "react";

import { DDTLaboresService } from "../../services/DDTLaboresService";
import { ProductosLaborPoService } from "../../services/ProductosLaborPOService";
import { LotePOService } from "../../services/LotesPOService";

var ddtLaboresService = new DDTLaboresService();
var productoLaborPo = new ProductosLaborPoService();
var lotePoService = new LotePOService;

export function HacerPedido() {

  const [dataFiltro, setDataFiltro] = useState([]);
  const [dataProductos, setDataProductos] = useState([]);
  const [dataProductosAprobados, setDataProductosAprobados] = useState([]);
  const [dataEmpleado, setDataEmpleado] = useState([]);
  const [selectedDdt, setSelectedDdt] = useState(null);
  
  const [fechaActual, setFechaActual] = useState(
    new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' })
  );
  const [fechaInicio, setFechaIncio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [temporada, setTemporada] = useState('');
  const [ddtFlag, setDdtFlag] = useState(false);
  const [productoDdtFlag, setProductoDdtFlag] = useState(false);

  useEffect(() => {
    console.log("Fecha actual:", fechaActual);
    setTemporada(sessionStorage.getItem("temporadaActiva"));
  }, []);

  useEffect(() => {
    getData();
  }, [ddtFlag]);

  useEffect(() => {
    console.log("Selected DDT:", selectedDdt);
    productoLaborPo.getByTempSiembraNumDepLabAliasDdt(
      selectedDdt?.temporada, selectedDdt?.siembraNumero, selectedDdt?.departamento, 
      selectedDdt?.labor, selectedDdt?.aliasLabor, selectedDdt?.ddt).then((res) => {
      console.log("Respuesta de la API PO:", res);
      setDataProductos(res.poProductosLabor);
      setProductoDdtFlag(false);
    }).catch((error) => {
      console.error("Error al obtener los datos:", error);
    })
  }, [productoDdtFlag]);

  useEffect(() => {
    setFechaFinal('');
  }, [fechaInicio]);

  const getData = async () => {
    ddtLaboresService.filterDdtAndLote(temporada, fechaInicio, fechaFinal).then((res) => {
      console.log("Respuesta de la API:", res.data);
      setDataFiltro(res.data.data);

    }).catch((error) => {
      console.error("Error al obtener los datos:", error);
    })
  }

  const CustomToolbar = (props) => (
    <div style={{ backgroundColor: '#408730', padding: '0' }}>
      <MTableToolbar style={{ padding: '0', height: '20px' }} {...props} />
    </div>
  );
  const isSmallScreen = useMediaQuery("(max-width:1200px)");

  return (
    <Container>
      <div className="bg-[#79a96f] h-10 items-center flex pl-2 text-white mb-3">
        <div className="ContenedorFecha gap-4 flex items-center">
          <div className="flex items-center gap-2">
            <p className="2xl:text-sm text-[12px]">Fecha Inicio</p>
            <input
              type="date"
              className="text-black text-[10px] lg:text-xs px-2 h-7 focus:outline-2 shadow-md rounded-md"
              value={fechaInicio}
              min={fechaActual}
              onChange={(e) => {
                setFechaIncio(e.target.value);
                console.log("Fecha inicio:", e.target.value);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <p className="2xl:text-sm text-[12px]">Fecha Final</p>
            <input
              type="date"
              className="text-black text-[10px] 2xl:text-xs px-2 h-7 focus:outline-2 shadow-md rounded-md"
              value={fechaFinal}
              min={fechaInicio || fechaActual}
              disabled={!fechaInicio}
              onChange={(e) => {
                setFechaFinal(e.target.value);
                console.log("Fecha final:", e.target.value);
              }}
            />
          </div>
          <Button endDecorator={<BiSearchAlt />} variant="soft"
            sx={{ height: "30px", minHeight: "0", fontSize: "13px", padding: "0 10px", fontWeight: "500", }} 
            disabled={!fechaInicio || !fechaFinal}
            onClick={() => {
              // if (fechaInicio && fechaFinal) {
              //   setDdtFlag(true);
              // } else {
              //   alert("Por favor, seleccione ambas fechas.");
              // }
              if (fechaInicio && fechaFinal) {
                getData();
              } else {
                alert("Por favor, seleccione ambas fechas.");
              }
            }}
            >Buscar</Button>
          <Button endDecorator={<BiInfoCircle />} variant="soft"
            sx={{ height: "30px", minHeight: "0", fontSize: "13px", padding: "0 10px", fontWeight: "500", }} >Sugerir</Button>
          <Button endDecorator={<BiSolidDetail />} variant="soft"
            sx={{ height: "30px", minHeight: "0", fontSize: "13px", padding: "0 10px", fontWeight: "500", }} >Ver boleta</Button>
        </div>
      </div>
      <div className="p-3 flex place-content-between max-w-[1500px] mb-3">
        <div>
          <MaterialTable
            data={dataFiltro || []}
            title={<div style={{ fontSize: '12px', color: 'white' }}>Productos</div>}
            columns={[{ title: 'Departamento', field: 'departamento' },
            { title: 'Cultivo', field: 'nombreDescriptivo', render: rowData => rowData.nombreDescriptivo ?? 'MELÓN' },
            { title: 'Labor', field: 'aliasLabor' },
            { title: 'Lote', field: 'aliasLote' },
            { title: 'Área', field: 'area' },
            { title: 'Fecha Base', field: 'fechaTrasplante' },
            { title: 'Días DT/DS/DC', field: 'ddt' }]}
            options={{
              selection: true,
              showSelectAllCheckbox: false,
              showTextRowsSelected: false,
              actionsColumnIndex: -1,
              paging: false,
              toolbar: false,
              search: true,
              maxBodyHeight: '20rem',
              headerStyle: { position: 'sticky', top: 0, backgroundColor: '#408730', color: 'white', fontWeight: '500', padding: '4px 0 0px 4px' },
              cellStyle: { padding: '4px 0 4px 9px' },
              rowStyle: rowData => ({
                backgroundColor: (selectedDdt?.ddt === rowData.ddt && selectedDdt?.siembraNumero === rowData.siembraNumero && 
                  selectedDdt?.aliasLabor === rowData.aliasLabor && selectedDdt?.aliasLote === rowData.aliasLote) ? '#3f842f41' : '#FFF'
              }),

              selectionProps: (rowData) => ({
                onChange: () => {
                  console.log("rowData",rowData)
                  setSelectedDdt((prevRow) => (prevRow?.ddt === rowData.ddt && prevRow?.siembraNumero === rowData.siembraNumero && 
                    prevRow?.aliasLabor === rowData.aliasLabor && prevRow?.aliasLote === rowData.aliasLote? null : rowData)); 
                },
                style: { display: 'none' }
              }),
            }}

            
            onRowClick={(event, rowData) => {
              setSelectedDdt((prevRow) => (prevRow?.ddt === rowData.ddt && prevRow?.siembraNumero === rowData.siembraNumero && 
                prevRow?.aliasLabor === rowData.aliasLabor && prevRow?.aliasLote === rowData.aliasLote? null : rowData)); 
              console.log("selectedDdt",selectedDdt)
              setProductoDdtFlag(true);
            }}

            style={{ width: "51vw", maxWidth: "800px", height: "", maxHeight: "50vh" }}
            components={{
              Toolbar: CustomToolbar,
            }}

            localization={{
              body: {
                emptyDataSourceMessage: 'No se encontraron Labores',
              },
              toolbar: {
                searchTooltip: 'Buscar',
                searchPlaceholder: 'Buscar',
              },
            }}

          />
        </div>
        <div>
          <div >
            <p className="mb-3" style={{ fontSize: isSmallScreen ? "12px" : "14px" }}>Ingrese el Código del empleado que aprueba</p>
            <Input placeholder="Codigo" type="number" variant="outlined" sx={{ width: isSmallScreen ? "100px" : "140px", marginBottom: "10px", fontSize: "14px" }} />
            <div className="mb-3 gap-3 flex items-center" >

              <Button color="success" sx={{ fontSize: isSmallScreen ? "11px" : "13px" }} className="shadow-md hover:-translate-y-1 transition-all"> Aprobar</Button>
              <Button sx={{ fontSize: isSmallScreen ? "11px" : "13px" }} className="shadow-md hover:-translate-y-1 transition-all" > Aprobar todo los pendientes</Button>
              <Button sx={{ fontSize: isSmallScreen ? "11px" : "13px" }} className="shadow-md hover:-translate-y-1 transition-all"> Guardar</Button>
            </div>

          </div>
          <MaterialTable
            data={dataEmpleado || []}
            title={<div style={{ fontSize: '12px', color: 'white' }}>Productos</div>}
            columns={[{ title: 'Codigo', field: 'idProducto' },
            { title: 'Existencia', field: 'nombreDescriptivo' }]}
            options={{
              selection: true,
              showSelectAllCheckbox: false,
              showTextRowsSelected: false,
              maxBodyHeight: '14rem',
              paging: false,
              toolbar: false,
              search: true,
              headerStyle: { position: 'sticky', top: 0, backgroundColor: '#e58356', color: 'white', fontWeight: '500', padding: '4px 0 0px 4px' },
              cellStyle: { padding: '4px 0 4px 9px' }
            }}

            style={{ height: "", maxHeight: "50vh" }}
            components={{
              Toolbar: CustomToolbar,
            }}

            localization={{
              body: {
                emptyDataSourceMessage: 'No se encontraron productos',
              },
              toolbar: {
                searchTooltip: 'Buscar',
                searchPlaceholder: 'Buscar',
              },
            }}

          />
        </div>
      </div>
      <div className="p-3 flex place-content-between max-w-[1500px]">
        <MaterialTable
          data={dataProductos || []}
          title={<div style={{ fontSize: '12px', color: 'white' }}>Productos</div>}
          columns={[
            { title: "Código", field: "idProducto", width: "15%" },
            { title: "Producto", field: "nombreDescriptivo", width: "60%" },
            { title: "Dosis Teorica(L)", field: "dosisHa", width: "15%" },
            { title: "Unidad", field: "unidadMedida", width: "15%" },
            { title: "Dosis Real(L)", field: "dosisHa", width: "15%" },]}
          options={{
            selection: true,
            showSelectAllCheckbox: false,
            showTextRowsSelected: false,
            maxBodyHeight: '14rem',
            paging: false,
            toolbar: false,
            search: true,
            headerStyle: { position: 'sticky', top: 0, backgroundColor: '#408730', color: 'white', fontWeight: '500', padding: '4px 0 0px 4px' },
            cellStyle: { padding: '4px 0 4px 9px' }
          }}

          style={{ width: "45vw", maxWidth: "800px", height: "", maxHeight: "50vh" }}
          components={{
            Toolbar: CustomToolbar,
          }}

          localization={{
            body: {
              emptyDataSourceMessage: 'No se encontraron productos',
            },
            toolbar: {
              searchTooltip: 'Buscar',
              searchPlaceholder: 'Buscar',
            },
          }} />
        <div className="Botones flex flex-col p-3 gap-2 justify-center">
          <IconButton className="boton-animado shadow-lg"
            sx={{
              fontSize: "13px", padding: "0 10px", fontWeight: "500", background: "#e58356", color: "white",
              "&:hover": {
                background: "#dc7342",
                color: "white",

              }
            }}
            onClick={() => {
              console.log("dataProductos", dataProductos);
              setDataProductosAprobados(dataProductos);
            }}
            >
            <BiChevronsRight className="icono-animado text-lg" /></IconButton>
          <IconButton className="boton-animado shadow-lg"
            sx={{
              fontSize: "13px", padding: "0 10px", fontWeight: "500", background: "#e58356", color: "white",
              "&:hover": {
                background: "#dc7342",
                color: "white"
              }
            }}>
            <BiChevronRight className="icono-animado text-lg" /></IconButton >
        </div>

        <MaterialTable
          data={dataProductosAprobados || []}
          title={<div style={{ fontSize: '12px', color: 'white' }}>Productos</div>}
          columns={[
            { title: "Producto", field: "nombreDescriptivo", }, // Más grande
            { title: "Dosis Lote", field: "dosisHa", },
            { title: "Número de boleta", field: "tipoUso" },
            { title: "Aprueba", field: "tipoUso" },]}
          options={{
            selection: true,
            showSelectAllCheckbox: false,
            showTextRowsSelected: false,
            maxBodyHeight: '14rem',
            paging: false,
            toolbar: false,
            search: true,
            headerStyle: { position: 'sticky', top: 0, backgroundColor: '#408730', color: 'white', fontWeight: '500', padding: '4px 0 0px 4px' },
            cellStyle: { padding: '4px 0 4px 9px' }
          }}

          style={{ height: "", maxHeight: "50vh" }}
          components={{
            Toolbar: CustomToolbar,
          }}

          localization={{
            body: {
              emptyDataSourceMessage: 'No se encontraron productos',
            },
            toolbar: {
              searchTooltip: 'Buscar',
              searchPlaceholder: 'Buscar',
            },
          }} />
      </div>
    </Container>
  )
}
const Container = styled.div`
.css-1g1pyhz-MuiTableCell-root {
    font-size: 0.875rem;
}

@keyframes moverFlecha {
  0% { transform: translateX(0); }
  50% { transform: translateX(5px); } /* Mueve la flecha 5px a la derecha */
  100% { transform: translateX(0); } /* Regresa a la posición original */
}

.icono-animado {
  transition: transform 1s ease-in-out;
}

.boton-animado:hover .icono-animado {
  animation: moverFlecha 1s ease-in-out infinite; /* Repite la animación mientras esté en hover */
}

@media (max-width: 1200px) {
    .css-1g1pyhz-MuiTableCell-root  {
        font-size: 0.625rem;/* 12px */
        }
    }

    @media (max-width: 992px) {
        .css-1g1pyhz-MuiTableCell-root  {
            font-size: 0.625rem;/* 12px */
        }
    }

    @media (max-width: 768px) {
        .css-1g1pyhz-MuiTableCell-root  {
            font-size: 0.625rem; /* 10px */
        }
    }

`
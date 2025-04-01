
import styled from "styled-components";
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import { Height } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { BiSearchAlt, BiInfoCircle,BiSolidDetail, BiChevronsRight, BiChevronRight   } from "react-icons/bi";
import MaterialTable,  { MTableToolbar } from "@material-table/core";
import React , { useEffect, useState } from "react";
export function HacerPedido() {
     const [data, setData] = useState([]);

        const CustomToolbar = (props) => (
            <div style={{ backgroundColor: '#408730', padding: '0' }}>
                <MTableToolbar style={{padding:'0', height: '20px'}} {...props} />
            </div>
        );
        const isSmallScreen = useMediaQuery("(max-width:1200px)");
   
    return (
        <Container>
            <div className="bg-[#79a96f] h-10 items-center flex pl-2 text-white mb-3">
                <div className="ContenedorFecha gap-4 flex items-center">
                <div className="flex items-center gap-2">
                 <p className="2xl:text-sm text-[12px]">Fecha Inicio</p>
                 <input type="date" className="text-black text-[10px] lg:text-xs px-2 h-7 focus:outline-2 shadow-md rounded-md"/>
                </div>

                <div className="flex items-center gap-2">
                 <p className="2xl:text-sm text-[12px]">Fecha Inicio</p>
                 <input type="date" className="text-black text-[10px] 2xl:text-xs px-2 h-7 focus:outline-2 shadow-md rounded-md"/>
                </div>
                <Button endDecorator={<BiSearchAlt />} variant="soft"
                 sx={{height: "30px",minHeight: "0",fontSize: "13px", padding: "0 10px",fontWeight: "500",}} >Buscar</Button>
                <Button endDecorator={<BiInfoCircle />} variant="soft"
                 sx={{height: "30px",minHeight: "0",fontSize: "13px", padding: "0 10px",fontWeight: "500",}} >Sugerir</Button>
                 <Button endDecorator={<BiSolidDetail />} variant="soft"
                 sx={{height: "30px",minHeight: "0",fontSize: "13px", padding: "0 10px",fontWeight: "500",}} >Ver boleta</Button>
                </div>
            </div>
            <div className="p-3 flex place-content-between max-w-[1500px] mb-3">
            <div>
                    <MaterialTable
                     data={data || []}
                     title={<div style={{ fontSize: '12px', color: 'white' }}>Productos</div>}
                     columns={[{title: 'Departamento', field: 'idProducto' },
                     {title: 'Cultivo', field: 'nombreDescriptivo' },
                     {title: 'Labor', field: 'tipoUso' },
                     {title: 'Lote', field: 'tipoUso' },
                     {title: 'Area', field: 'tipoUso' },
                     {title: 'Fecha Baase', field: 'tipoUso' },
                     {title: 'Dias DT/DS/DC', field: 'tipoUso' }]}
                     options={{
                      selection:true,
                      showSelectAllCheckbox: false,
                      showTextRowsSelected: false,
                        actionsColumnIndex: -1,
                        paging: false,
                        toolbar: false,
                        search: true,
                        headerStyle: { position: 'sticky', top: 0, backgroundColor: '#408730', color: 'white', fontWeight: '500', padding: '4px 0 0px 4px' },
                        cellStyle: {padding: '4px 0 4px 9px' }
                    }}
            
                    style={{ width: "51vw" , maxWidth: "800px", height: "", maxHeight: "50vh"}}
                    components={{
                        Toolbar:CustomToolbar,
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
            <div>
            <div >
                <p className="mb-3" style={{ fontSize: isSmallScreen ? "12px" : "14px" }}>Ingrese el Codigo del empleado que aprueva</p>
                <Input placeholder="Codigo" type="number" variant="outlined" sx={{width: isSmallScreen ? "100px" :"140px", marginBottom:"10px", fontSize: "14px"}}/>
                <div className="mb-3 gap-3 flex items-center" >
                    
                    <Button color="success" sx={{ fontSize: isSmallScreen ? "11px" : "13px" }} className="shadow-md hover:-translate-y-1 transition-all"> Aprobar</Button>
                    <Button sx={{ fontSize: isSmallScreen ? "11px" : "13px" }} className="shadow-md hover:-translate-y-1 transition-all" > Aprobar todo los pendientes</Button>
                    <Button sx={{ fontSize: isSmallScreen ? "11px" : "13px" }} className="shadow-md hover:-translate-y-1 transition-all"> Guardar</Button>
                </div>
                
            </div>
            <MaterialTable
                     data={data || []}
                     title={<div style={{ fontSize: '12px', color: 'white' }}>Productos</div>}
                     columns={[{title: 'Codigo', field: 'idProducto' },
                     {title: 'Existencia', field: 'nombreDescriptivo' }]}
                     options={{
                      selection:true,
                      showSelectAllCheckbox: false,
                      showTextRowsSelected: false,
                        
                        paging: false,
                        toolbar: false,
                        search: true,
                        headerStyle: { position: 'sticky', top: 0, backgroundColor: '#e58356', color: 'white', fontWeight: '500', padding: '4px 0 0px 4px' },
                        cellStyle: {padding: '4px 0 4px 9px' }
                    }}
            
                    style={{  height: "", maxHeight: "50vh"}}
                    components={{
                        Toolbar:CustomToolbar,
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
                     data={data || []}
                     title={<div style={{ fontSize: '12px', color: 'white' }}>Productos</div>}
                     columns={[
                        { title: "Codigo", field: "idProducto", width: "15%" },
                        { title: "Producto", field: "nombreDescriptivo", width: "60%" }, // Más grande
                        { title: "Dosis Teorica(L)", field: "tipoUso", width: "15%" },
                        { title: "Unidad", field: "tipoUso", width: "15%" },
                        { title: "Dosis Real(L)", field: "tipoUso", width: "15%" },]}
                     options={{
                      selection:true,
                      showSelectAllCheckbox: false,
                      showTextRowsSelected: false,

                        paging: false,
                        toolbar: false,
                        search: true,
                        headerStyle: { position: 'sticky', top: 0, backgroundColor: '#408730', color: 'white', fontWeight: '500', padding: '4px 0 0px 4px' },
                        cellStyle: {padding: '4px 0 4px 9px' }
                    }}
            
                    style={{ width: "45vw" , maxWidth: "800px", height: "", maxHeight: "50vh"}}
                    components={{
                        Toolbar:CustomToolbar,
                    }}
                
                    localization={{
                      body: {
                        emptyDataSourceMessage: 'No se encontraron productos',
                      },
                      toolbar: {
                        searchTooltip: 'Buscar',
                        searchPlaceholder: 'Buscar',
                      },
                    }}  />
                    <div className="Botones flex flex-col p-3 gap-2 justify-center">
                        <IconButton className="boton-animado shadow-lg"
                        sx={{ fontSize: "13px", padding: "0 10px", fontWeight: "500", background: "#e58356", color: "white", 
                            "&:hover": {
                                background: "#dc7342",
                                color: "white",

                              }
                         }}>
                            <BiChevronsRight className="icono-animado text-lg"/></IconButton>
                            <IconButton className="boton-animado shadow-lg"
                        sx={{ fontSize: "13px", padding: "0 10px", fontWeight: "500", background: "#e58356", color: "white", 
                            "&:hover": {
                                background: "#dc7342",
                                color: "white"
                              }
                         }}>
                            <BiChevronRight className="icono-animado text-lg"/></IconButton >
                    </div>

                    <MaterialTable
                     data={data || []}
                     title={<div style={{ fontSize: '12px', color: 'white' }}>Productos</div>}
                     columns={[
                        { title: "Codigo", field: "idProducto", },
                        { title: "Producto", field: "nombreDescriptivo", }, // Más grande
                        { title: "Dosis Teorica(L)", field: "tipoUso",  },
                        { title: "Unidad", field: "tipoUso"},
                        { title: "Dosis Real(L)", field: "tipoUso" },]}
                     options={{
                      selection:true,
                      showSelectAllCheckbox: false,
                      showTextRowsSelected: false,

                        paging: false,
                        toolbar: false,
                        search: true,
                        headerStyle: { position: 'sticky', top: 0, backgroundColor: '#408730', color: 'white', fontWeight: '500', padding: '4px 0 0px 4px' },
                        cellStyle: {padding: '4px 0 4px 9px' }
                    }}
            
                    style={{ height: "", maxHeight: "50vh"}}
                    components={{
                        Toolbar:CustomToolbar,
                    }}
                
                    localization={{
                      body: {
                        emptyDataSourceMessage: 'No se encontraron productos',
                      },
                      toolbar: {
                        searchTooltip: 'Buscar',
                        searchPlaceholder: 'Buscar',
                      },
                    }}  />
            </div>
        </Container>
    )
}
const  Container = styled.div`
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
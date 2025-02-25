import styled from "styled-components";  
import List from '@mui/material/List';  
import ListItemText from '@mui/material/ListItemText';  
import ListItemButton from '@mui/material/ListItemButton';  
import ListSubheader from '@mui/material/ListSubheader';  
import { LaboresService } from "../../services/LaboresService";  
import { LaboresTService } from "../../services/LaboresTService";  
import { TemporadasService } from "../../services/TemporadasService";  
import { Utils } from '../../models/Utils';  
import MaterialTable, { MTableToolbar } from "@material-table/core";  
import { Delete, Edit, AddBox } from '@mui/icons-material';  
import React, { useState, useEffect } from "react";  
import { DDTLaboresService } from "../../services/DDTLaboresService";

const laboresService = new LaboresService();  
const laboresTService = new LaboresTService();  
const temporadaService = new TemporadasService();  
const ddtLaboresService = new DDTLaboresService();  

export function AsignarDDT() {  
  const [labores, setLabores] = useState([]);  
  const [data, setData] = useState([]);  
  const [tempActiva, setTempActiva] = useState([]);  
  const [maxBodyHeight, setMaxBodyHeight] = useState(480);  
  const [widthNpdy, setWidthNpdy] = useState(700);  
  const [selectedIndex, setSelectedIndex] = useState(null);  
  const [departamentoLabor, setDepartamentoLabor] = useState([]);  
  const [ddtList, setDdtList] = useState([]);  
  const [isAddEnabled, setIsAddEnabled] = useState(false);  
  const [selectedRow, setSelectedRow] = useState(null); 
  const [ddtValue, setDdtValue] = useState('');
  const [ddtData, setDdtData] = useState([]); 


  useEffect(() => {  
    Utils.fetchData(temporadaService.getActual(), setTempActiva, "temporadaActual");  
    Utils.fetchData(laboresService.getAll(), setLabores, "labores");  
  }, []);  

  useEffect(() => {  
    if (departamentoLabor.length > 0 && tempActiva.length > 0) {  
      Utils.fetchData(  
        laboresTService.getByDepartamento(tempActiva[0]?.temporada, departamentoLabor[0], departamentoLabor[1]),  
        setData,  
        "laboresTemporada"  
      );  
    }  
  }, [departamentoLabor, tempActiva]);  

  const handleResize = () => {  
    if (window.innerWidth < 1300) {  
      setMaxBodyHeight(470);  
      setWidthNpdy("61vw");  
    } else if (window.innerWidth < 2000) {  
      setMaxBodyHeight(580);  
      setWidthNpdy("63vw");  
    } else {  
      setMaxBodyHeight(480);  
      setWidthNpdy("60vw");  
    }  
  };  

  useEffect(() => {  
    handleResize();  
    window.addEventListener("resize", handleResize);  
    return () => window.removeEventListener("resize", handleResize);  
  }, []);  

  const laboresPorDepartamento = labores.reduce((acc, labor) => {  
    if (!acc[labor.departamento]) {  
      acc[labor.departamento] = [];  
    }  
    acc[labor.departamento].push(labor);  
    return acc;  
  }, {});  

  const seccionLista = (event, departamento, index, labor) => {  
    setSelectedIndex(`${departamento}-${index}`);  
    setDepartamentoLabor([departamento, labor]);  
    setIsAddEnabled(true);  
  };  

  useEffect(() => {  
    if (selectedRow?.aliasLabor) {  
        console.log("📡 Fetching DDTs para aliasLabor:", selectedRow.aliasLabor);

        ddtLaboresService.getByAliasLabor(selectedRow.aliasLabor)  
            .then(response => {  
                if (response?.success && Array.isArray(response.ddtLabores)) {  
                    const ddtRows = response.ddtLabores.map(ddt => ({  
                        ddt: ddt.ddt,  // Nos aseguramos de mantener el formato correcto
                    }));  

                    console.log("✅ DDTs obtenidos:", ddtRows);
                    setDdtData(ddtRows);  
                } else {  
                    console.error("⚠️ Formato de respuesta inesperado:", response);
                    setDdtData([]); // Si hay error, limpiamos la tabla
                }  
            })  
            .catch(err => {  
                console.error("❌ Error al obtener DDTs:", err);
                setDdtData([]); // Si hay error, limpiamos la tabla
            });  
    } else {  
        console.warn("⚠️ No hay selectedRow o aliasLabor vacío");
        setDdtData([]); // Limpiamos la tabla si no hay una fila seleccionada
    }
}, [selectedRow?.aliasLabor]);  // 🚀 Dependemos solo de aliasLabor para detectar cambios

   

  const columnsDDT = [  
    {  
      title: 'Ddts',  
      field: 'ddt',  
    },  
  ];  
  

  const addDdt = () => {  
    console.log("Adding DDT:", ddtValue); 
  
    if (selectedRow && ddtValue.trim()) {  
        const newDdt = {  
            Ddt: ddtValue,  
            Temporada: selectedRow.temporada,  
            SiembraNumero: selectedRow.siembraNumero,  
            Departamento: selectedRow.departamento,  
            Labor: selectedRow.labor,  
            AliasLabor: selectedRow.aliasLabor,  
          };  
      console.log("Datos a enviar:", JSON.stringify(newDdt, null, 2));

      ddtLaboresService.create(newDdt)  
        .then(() => {  
          console.log("DDT agregado correctamente");
          setDdtData(prevList => [...prevList, newDdt]);
          setDdtValue(""); 
        })  
        .catch(error => {  
          console.error("Error al agregar DDT:", error);  
        });  
    } else {
      console.warn("Faltan datos: selectedRow o ddtValue está vacío");
    }
  };

  const updateDdt = (oldDdt, newDdt) => {  
    const { temporada, siembraNumero, departamento, labor, aliasLabor } = selectedRow; 

    if (!oldDdt || !newDdt) {
        console.error("❌ Error: oldDdt o newDdt son inválidos.", { oldDdt, newDdt });
        return;
    }
    const ddtToUpdate = parseInt(oldDdt.ddt, 10);  
    const newDdtValue = parseInt(newDdt.ddt, 10); 

    const updatedDdt = {  
        Temporada: temporada,  
        SiembraNumero: siembraNumero,  
        Departamento: departamento,  
        Labor: labor,  
        AliasLabor: aliasLabor,  
        Ddt: newDdtValue,  
    };  

    console.log("🚀 Enviando actualización a la API con:", {
        temporada,
        departamento,
        siembraNumero,
        labor,
        aliasLabor,
        ddtToUpdate,
        updatedDdt
    }); 
    ddtLaboresService.update(temporada, departamento, siembraNumero, labor, aliasLabor, ddtToUpdate, updatedDdt)  
        .then(() => {  
            setDdtData(prevList => prevList.map(ddt =>  
                ddt.ddt === ddtToUpdate ? { ...ddt, ddt: newDdtValue } : ddt  
            )); 
        })  
        .catch(error => {  
            console.error("❌ Error al actualizar DDT:", error);  
        });  
};

  const deleteDdt = (ddtRow) => {  
    if (!selectedRow || !ddtRow.ddt) {  
        console.error("No se puede eliminar: Datos inválidos.");  
        return;  
    }

    const { temporada, departamento, siembraNumero, labor, aliasLabor } = selectedRow;

    if (window.confirm("Are you sure you want to delete this DDT?")) {
        ddtLaboresService.delete(temporada, departamento, siembraNumero, labor, aliasLabor, ddtRow.ddt)  
            .then((response) => {  
                console.log("Respuesta de eliminación:", response);

                if (response.success) {  
                    setDdtData(prevList => prevList.filter(item => item.ddt !== ddtRow.ddt));  
                    console.log("DDT eliminado correctamente");
                } else {  
                    console.warn("No se pudo eliminar el DDT:", response.message);  
                }  
            })  
            .catch(error => {  
                console.error("Error al eliminar DDT:", error);  
            });  
    }
};



            const columnLabores = [  
              {  
                title: 'Temporada', field: 'temporada', initialEditValue: tempActiva[0]?.temporada, editable: 'never',  
              },  
              {  
                title: 'N° Siembra', field: 'siembraNumero', type: "numeric", editable: 'never',  
              },  
              {  
                title: 'Departamento', field: 'departamento', initialEditValue: departamentoLabor[0], editable: 'never', 
              },  
              {  
                title: 'Labor', field: 'labor', initialEditValue: departamentoLabor[1], editable: 'never',    
              },  
              {  

                title: 'Alias Labor', field: 'aliasLabor', editable: 'never',  
              }  
            ];  
          
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
                      height: 'fit-content',  
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
                            <ListItemButton key={`item-${departamento}-${index}`}  
                              selected={selectedIndex === `${departamento}-${index}`}  
                              onClick={(event) => seccionLista(event, departamento, index, labor.labor)}  
                            >  
                              <ListItemText secondary={labor.labor} />  
                            </ListItemButton>  
                          ))}  
                        </ul>  
                      </li>  
                    ))}  
                  </List>  
                    

                  <div className="flex gap-2">  
      {/* Contenedor para las tablas */}  
      <div style={{ flex: 1 }}> {/* Espacio flexible para la tabla "Asignar DDT a Labores de temporada" */}  
        <MaterialTable  
                  onRowClick={(event, rowData) => {
                    setSelectedRow(rowData); 
                    console.log("Fila seleccionada:", rowData); 
                  }}
                    size="small"  
                    data={data}  
                    title={<div style={{ fontSize: '16px' }}>Asignar DDT a Labores de temporada</div>}  
                    columns={columnLabores}  
                        options={{  
                        actionsColumnIndex: -1,  
                        addRowPosition: "first",  
                      maxBodyHeight: maxBodyHeight,  
                      paging: false,  
                      overflowX: "auto",  
                      padding: "dense",  
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
                    components={{  
                      Toolbar: (props) => (  
                        <div style={{  
                          backgroundColor: '#50ad53',  
                          height: '60px',  
                          color: 'white',  
                        }}>  
                          <MTableToolbar style={{ padding: '0' }} {...props} />  
                        </div>  
                      ),  
                    }}  
                    localization={{  
                      body: {  
                        emptyDataSourceMessage: 'Seleccione un DDT e ingrese los datos',  
                      },  
                      toolbar: {  
                        searchTooltip: 'Buscar',  
                        searchPlaceholder: 'Buscar',  
                      },  
                    }}  
                    editable={{}
                }>  
                
                
                </MaterialTable>  
                </div>  
                <div>  
        <h3>Ingrese el DDT:</h3>   
        <input  
          type="text"  
          value={ddtValue}  
          onChange={(e) => setDdtValue(e.target.value)}  
        />  
        <button onClick={addDdt} disabled={!selectedRow}>Agregar DDT</button>  
        
        <MaterialTable  
          title="Lista de DDTs"
          data={ddtData}  
          columns={columnsDDT}   
            style={{ width: widthNpdy, maxWidth: "200px" }}
                      icons={{
                        Add: () => <AddBox style={{ fontSize: "25px", color: "white" }} />, // Cambia el tamaño del ícono de agregar
                        Edit: () => <Edit style={{ fontSize: "18px" }} />, // Cambia el tamaño del ícono de editar
                        Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />, // Cambia el tamaño y color del ícono de eliminar
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
                      components={{
                                  Toolbar: (props) => (
                                    <div style={{
                                      backgroundColor: '#50ad53',
                                      height: '2%',
                                      color: 'white',
                      
                                    }}>
                                      <MTableToolbar style={{ padding: '0' }} {...props}></MTableToolbar>
                                    </div>
                                  ),
                                }}

            editable={{}}
          actions={[  
            {  
              icon: () => <Edit style={{ fontSize: "18px" }} />,  
              tooltip: 'Editar DDT',  
              onClick: (event, rowData) => {  
                const newDdtValue = prompt("Nuevo DDT:", rowData.ddt);
if (newDdtValue) {  
    const updatedDdt = {
        ...rowData,
        ddt: newDdtValue
    };

    console.log("Nuevo DDT antes de actualizar:", updatedDdt);

    updateDdt(rowData, updatedDdt);
}

              },  
            },  
            {  
                icon: () => <Delete style={{ fontSize: "18px", color: "red" }} />,  
                tooltip: 'Eliminar DDT',  
                onClick: (event, rowData) => deleteDdt(rowData)  
            }  
          ]}  
          options={{  
            actionsColumnIndex: -1,  
            paging: false,  
            search: false,  
            headerStyle: { position: 'sticky', top: 0, backgroundColor: '#f5f5f5' },  
          }}  
        />  
      </div> 
      </div>  
    </div>  
              </Container>  
            );  
          }  
          
          const Container = styled.div`  
            gap: 10px;  
            
            
            .css-1a1whku-MuiTypography-root {  
              font-size: 12px;  
              color: black;  
              font-family: 'popins', sans-serif;  
            }  
            
            .css-l328gy-MuiListSubheader-root {  
              font-size: 12px;  
            }  
            
            .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular.css-ig9rso-MuiToolbar-root {  
              padding-right: 0;  
            }  
          
            .ListSubheader {  
              font-size: 12px;  
            }  
          
            @media (min-width: 700px) {  
              .MuiTableCell-root {  
                padding: 4px 8px;  
                font-size: 9px !important;  
              }  
              .css-1a1whku-MuiTypography-root {  
                font-size: 10px;  
                color: black;  
                font-family: 'popins', sans-serif;  
              }  
              .css-l328gy-MuiListSubheader-root {  
                font-size: 14px;  
              }  
            }  
          
            @media (min-width: 1200px) {  
              max-width: 1400px;  
              .MuiTableCell-root {  
                padding: 4px 8px;  
                font-size: 12px !important;  
              }  
              .css-1a1whku-MuiTypography-root {  
                font-size: 12px;  
                color: black;  
                font-family: 'popins', sans-serif;  
              }  
              .css-l328gy-MuiListSubheader-root {  
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
          `;
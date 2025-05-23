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
import { showToast } from "../../components/helpers";

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
  const [widthList, setWidthList] = useState(200);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [departamentoLabor, setDepartamentoLabor] = useState([]);
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
      setWidthList(200);
    } else if (window.innerWidth < 2000) {
      setMaxBodyHeight(580);
      setWidthNpdy("63vw");
      setWidthList(250);
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
    setDdtData([]); // Reset DDT data when a new labor is selected
    setSelectedRow(null); // Reset selected row when a new labor is selected
  };

  useEffect(() => {
    const { departamento, labor, aliasLabor } = selectedRow || {};

    if (departamento && labor && aliasLabor) {
      console.log("📡 Fetching DDTs para Departamento, Labor y AliasLabor:", selectedRow.departamento, selectedRow.labor, selectedRow.aliasLabor);

      ddtLaboresService.getByDepartamentoLaborAlias(selectedRow.departamento, selectedRow.labor, selectedRow.aliasLabor)
        .then(response => {
          console.log("Respuesta obtenida:", response);

          if (response?.success && Array.isArray(response.ddtLabores)) {
            const ddtRows = response.ddtLabores.map(ddt => ({
              ddt: ddt.ddt,
            }));

            console.log("DDTs procesados:", ddtRows);
            setDdtData(ddtRows);
          } else {
            console.error("Formato de respuesta inesperado:", response);
            setDdtData([]);
          }
        })
        .catch(err => {
          console.error(" Error al obtener DDTs:", err);
          setDdtData([]);
        });
    } else {
      console.warn("No hay selectedRow, departamento, labor o aliasLabor vacío");
      setDdtData([]);
    }
  }, [selectedRow]);


  const columnsDDT = [
    {
      title: 'DDTS',
      field: 'ddt',
      type: "numeric",
    },
  ];


  const addDdt = () => {
    console.log("Añadiendo DDT:", ddtValue);

    if (selectedRow && ddtValue.trim()) {
      const newDdt = {
        Ddt: ddtValue,
        Temporada: selectedRow.temporada,
        SiembraNumero: selectedRow.siembraNumero,
        Departamento: selectedRow.departamento,
        Labor: selectedRow.labor,
        AliasLabor: selectedRow.aliasLabor || '',
      };

      console.log("Datos a enviar:", JSON.stringify(newDdt, null, 2));

      // Cambia la forma en que manejas las DDT  
      ddtLaboresService.create(newDdt)
        .then(response => {
          if (response.success) {
            console.log("DDT agregado correctamente", response);
            const newDdtRow = { ddt: response.ddt || ddtValue };

            setDdtData(prevData => {
              const updatedData = [newDdtRow, ...prevData];
              console.log("data actualizada", updatedData);
              return updatedData;
            });
            setDdtValue("");
            showToast('success', 'DDT agregado correctamente', '#107c10');
          } else {
            if (response.status === 400 && response.message === "El DDT ya existe.") {
              showToast('error', 'El DDT ya existe.', '#d32f2f');
            } else {
              showToast('error', `Error al agregar el DDT: ${response.message}`, '#d32f2f');
            }
          }
        })
        .catch(error => {
          console.error("Error al agregar el DDT", error);
          showToast('error', `Error al agregar el DDT: ${error.message}`, '#9c1010');
        });
    } else {
      console.warn("Faltan datos: selectedRow o ddtValue está vacío");
      showToast('warning', 'Por favor, seleccione una fila e ingrese un DDT', '#d89b00');
    }
  };



  const updateDdt = async (oldDdt, newDdt) => {
    const { temporada, siembraNumero, departamento, labor, aliasLabor } = selectedRow;

    if (!oldDdt || !newDdt || isNaN(newDdt.ddt)) {
      console.error("❌ Error: oldDdt o newDdt son inválidos.", { oldDdt, newDdt });
      showToast('error', 'Datos inválidos para actualizar el DDT', '#9c1010');
      return Promise.reject();
    }

    const ddtToUpdate = parseInt(oldDdt.ddt, 10);
    const newDdtValue = parseInt(newDdt.ddt, 10);

    const updatedDdt = {
      Temporada: temporada,
      SiembraNumero: siembraNumero,
      Departamento: departamento,
      Labor: labor.trim(),
      AliasLabor: aliasLabor.trim(),
      Ddt: newDdtValue,
    };

    console.log("🚀 Enviando actualización a la API con:", { ddtToUpdate, updatedDdt });

    try {
      await ddtLaboresService.update(temporada, departamento, siembraNumero, labor.trim(), aliasLabor.trim(), ddtToUpdate, updatedDdt);
      setDdtData(prevList => {
        return prevList.map(ddt => {
          if (ddt.ddt === ddtToUpdate) {
            return { ...ddt, ddt: newDdtValue };
          }
          return ddt;
        });
      });
      showToast('success', 'DDT actualizado correctamente', '#107c10');
    } catch (error) {
      console.error("❌ Error al actualizar DDT:", error.message);
      showToast('error', `Error al actualizar el DDT: ${error.message}`, '#9c1010');
      return await Promise.reject();
    }
  };



  const deleteDdt = (ddtRow) => {
    if (!selectedRow || !ddtRow.ddt) {
      console.error("No se puede eliminar: Datos inválidos.");
      showToast('error', 'No se puede eliminar: Datos inválidos', '#9c1010');
      return;
    }

    const { temporada, departamento, siembraNumero, labor, aliasLabor } = selectedRow;
    ddtLaboresService.delete(temporada, departamento, siembraNumero, labor, aliasLabor, ddtRow.ddt)
      .then((response) => {
        console.log("Respuesta de eliminación:", response);

        if (response.success) {
          setDdtData(prevList => prevList.filter(item => item.ddt !== ddtRow.ddt));
          console.log("DDT eliminado correctamente");
          showToast('success', 'DDT eliminado correctamente', '#107c10');
        } else {
          console.warn("No se pudo eliminar el DDT:", response.message);
          showToast('warning', 'No se pudo eliminar el DDT', '#d89b00');
        }
      })
      .catch(error => {
        console.error("Error al eliminar DDT:", error);
        showToast('error', 'Error al eliminar el DDT', '#9c1010');
      });
  };



  const columnLabores = [
    {
      title: 'Temporada',
      field: 'temporada',
      initialEditValue: tempActiva[0]?.temporada,
      editable: 'never',
      headerStyle: { minWidth: '6vw', maxWidth: '6vw' },
      cellStyle: { minWidth: '6vw', maxWidth: '6vw' }
    },
    {
      title: 'N° Siembra',
      field: 'siembraNumero',
      type: "numeric",
      editable: 'never',
      headerStyle: { minWidth: '6vw', maxWidth: '6vw' },
      cellStyle: { minWidth: '6vw', maxWidth: '6vw' }
    },
    {
      title: 'Departamento',
      field: 'departamento',
      initialEditValue: departamentoLabor[0],
      editable: 'never',
      headerStyle: { minWidth: '8vw', maxWidth: '8vw' },
      cellStyle: { minWidth: '8vw', maxWidth: '8vw' }
    },
    {
      title: 'Labor',
      field: 'labor',
      initialEditValue: departamentoLabor[1],
      editable: 'never',
      headerStyle: { minWidth: '20vw', maxWidth: '20vw' },
      cellStyle: { minWidth: '20vw', maxWidth: '20vw' }
    },
    {
      title: 'Alias Labor',
      field: 'aliasLabor',
      editable: 'never',
      headerStyle: { minWidth: '20vw', maxWidth: '20vw' },
      cellStyle: { minWidth: '20vw', maxWidth: '20vw' }
    }
  ];


  return (
    <Container>
      <div className="group relative w-1/6 h-12 mb-3 p-2 bg-slate-300 rounded-md overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-lime-300 transition-all duration-500 scale-x-0 origin-left group-hover:scale-x-100"></div>
        <span className="absolute inset-0 text-center text-sm flex items-center justify-center text-slate-900 z-10">
          Temporada: {tempActiva[0]?.temporada ?? "No hay temporada activa"}
        </span>
      </div>
      <div className="wrapper w-min">
        <div className="flex gap-4 max-xl:flex-wrap justify-between">
          {/*Pareja 1*/}
          <div className={`box-1  w-[${widthList}] order-1`}>

            <List
              sx={{
                width: '100%',
                //maxWidth: 220,
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
          </div>
          {/*responsive abajo*/}
          <div className="box-2  xl:w-auto order-3 xl:order-2">
            <MaterialTable
              onRowClick={(event, rowData) => {
                setSelectedRow(rowData);
                setDdtData([]);
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
                options: {
                  tableLayout: "fixed",
                },
                searchFieldStyle: {
                  fontSize: "14px",
                  width: "120px",
                  padding: "0",
                },
                rowStyle: rowData => ({
                  backgroundColor: (selectedRow && selectedRow.tableData.id === rowData.tableData.id) ? '#EDF4FB' : '#FFF'
                })
              }}
              style={{ maxWidth: "100%", width: "100%" }}
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
                  emptyDataSourceMessage: 'Seleccione una Labor de la lista',
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

          {/*PAreja 2*/}
          <div className="box-3  xl:w-auto order-2 xl:order-3 relative top-[-30px]">
            <h3>Ingrese el DDT:</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <input
                type="number"
                value={ddtValue}
                onChange={(e) => setDdtValue(e.target.value)}
                onFocus={() => {
                  if (!selectedRow) {
                    showToast('warning', 'Debe seleccionar una labor antes de ingresar un DDT', '#d89b00');
                  }
                }}
                style={{ paddingLeft: '20px', width: '100px', height: '30px', borderRadius: '5px', border: '1px solid #d3d3d3' }}

              />
              <button
                onClick={addDdt}
                disabled={!selectedRow}
                style={{
                  backgroundColor: selectedRow ? '#50ad53' : '#d3d3d3',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: selectedRow ? 'pointer' : 'not-allowed',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.3s ease',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Agregar
              </button>
            </div>
            <MaterialTable
              data={ddtData}
              //key={ddtData.length}
              columns={columnsDDT}
              style={{ width: widthNpdy, maxWidth: "220px" }}
              
              components={{
                Toolbar: (props) => (
                  <div style={{
                    backgroundColor: '#50ad53',
                    height: '2%',
                    color: 'white',
                  }}>
                    <MTableToolbar style={{ padding: '0' }} {...props} />
                  </div>
                ),
              }}
              options={{
                maxBodyHeight: '12rem',
                actionsColumnIndex: -1,
                paging: false,
                toolbar: false,
                search: false,
                headerStyle: { position: 'sticky', top: 0, backgroundColor: '#50ad53', color: 'white', zIndex: 100 },
              }}
              cellEditable={{
                onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                  return new Promise((resolve, reject) => {
                    if (!newValue) {
                      showToast('error', 'El DDT no puede estar vacío', '#9c1010');
                      return reject();
                    }

                    const updatedDdt = {
                      ...rowData,
                      ddt: parseInt(newValue, 10)
                    };

                    console.log("🚀 Enviando actualización a la API con:", updatedDdt);

                    updateDdt(rowData, updatedDdt)
                      .then(() => resolve())
                      .catch(() => reject());
                  });
                }
              }}
              icons={{ Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />,}}
              editable={{
                onRowDelete: (oldData) =>
                  new Promise((resolve, reject) => {
                    deleteDdt(oldData);
                    resolve();
                  }),
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No posee DDTs',
                  editRow: {
                    deleteText: (
                      <span className="custom-delete-text">
                        ¿Desea Eliminarlo?
                      </span>
                    ),
                    cancelTooltip: 'Cancelar',
                    saveTooltip: 'Confirmar',
                  },
                },
                header: { actions: '' },
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
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;


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

  .custom-delete-text {
    font-family: 'Arial', sans-serif; 
    font-size: 14px; 
    color: red; 
  }
`;
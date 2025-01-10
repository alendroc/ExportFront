import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, {useState, useEffect  } from "react";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import { showToast } from "../../components/helpers";
import { HibridosService } from "../../services/HibridosService";
import { VariedadesService } from "../../services/variedadesService"; 
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Hibrido } from "../../models/Hibrido";

var hibridosService = new HibridosService;
var variedadesService=new VariedadesService;
var hibridoObj = new Hibrido();
const columns = [
  { title: "Cultivo", field: "cultivo", editable: false,},

  { title: "Variedad", field: "variedad", editable: false,},

  { title: "Hibrido", field: "hibrido", editable: 'onAdd', validate: (row) => {
    if((row.hibrido || "").length === 0){return false}
    if(row.hibrido?.length > 50){
      return {
        isValid: false,
        helperText: "El límite de la columna es de 50 carácteres"
    };}
  }},
  
  { title: "Abreviatura",  field: "abreviatura",validate: (row) =>{
    if(row.abreviatura?.length > 10){
     return {
       isValid: false,
       helperText: "El límite de la columna es de 10 carácteres"
   };}
 } },

  { title: "Descripción", field: "descripcion" ,validate: (row) =>{
    if(row.descripcion?.length > 500){
     return {
       isValid: false,
       helperText: "El límite de la columna es de 500 carácteres"
   };}
 } },

  { title: "Activo", field: "activo", type: "boolean" },
];

export function Hibridos() {
    const [data, setData] = useState([]);
    const [dataFiltrada, setDataFiltrada] = useState([]);
    const [cultivo, setCultivo] = useState('');
    const [variedad, setVariedad] = useState('');
    const [cultivosDisponibles, setCultivosDisponibles] = useState([]);
    const [variedadesDisponibles, setVariedadesDisponibles] = useState([]);
    const [desabilitado, setDesabilitado] = useState(true)
    const [variedadesFiltradas, setVariedadesFiltradas] = useState([]);

    const [maxBodyHeight, setMaxBodyHeight] = useState(480);
    //Agregar
    useEffect(() => {
      const fetchData = async () => {
          try {
              const [hibridosResponse, variedadesResponse] = await Promise.all([
                  hibridosService.getAll(),
                  variedadesService.getAll()
              ]);

              console.log("Respuesta completa de híbridos:", hibridosResponse);
              console.log("Respuesta completa de variedades:", variedadesResponse);
  
              if (hibridosResponse.success || variedadesResponse.success) {
                const hibridosResp = hibridosResponse.hibridos || [];
                const variedadesResp = variedadesResponse.variedades || [];


                  setData(hibridosResp);

                  const allCultivos = [
                      ...hibridosResp.map(e => e.cultivo),
                      ...variedadesResp.map(e => e.cultivo)
                  ];
                  const uniqueCultivos = Array.from(new Set(allCultivos));
                  setCultivosDisponibles(uniqueCultivos);

                  const allVariedades = variedadesResponse.variedades.map(e => ({
                    variedad: e.variedad,
                    cultivo: e.cultivo
                }));
                console.log("variedades: ",allVariedades);

                  const uniqueVariedades = Array.from(new Set(allVariedades));
                  setVariedadesDisponibles(uniqueVariedades);
                  setVariedadesFiltradas(uniqueVariedades);
                  
                  console.log("Híbridos:", hibridosResponse.hibridos);
                  console.log("Variedades:", variedadesResponse.variedades);
              } else {
                  console.log("No se pudieron obtener los datos de híbridos o variedades.");
              }
          } catch (error) {
              console.error("Error al obtener los datos:", error);
          }
      };
      fetchData();
  }, []);
  


    useEffect(() => {
        const handleResize = () => {
      if (window.innerWidth < 1300) {
        setMaxBodyHeight(470); 
      } else if (window.innerWidth < 2000) {
        setMaxBodyHeight(580);
      } else {
        setMaxBodyHeight(480);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChangeCultivo = (event) => {
    setCultivo(event.target.value);

    const variedadesFiltradas = variedadesDisponibles.filter(v => v.cultivo === event.target.value);
    setVariedadesFiltradas(variedadesFiltradas);

    console.log("variedades filtradas: ",variedadesFiltradas);
    setVariedad("");

    setDataFiltrada(data.filter(d => d.variedad ===variedad  && d.cultivo === event.target.value));
    setDesabilitado(true);
};

const handleChangeVariedad = (event) => {
  setVariedad(event.target.value);
  setDataFiltrada(data.filter(d => d.variedad === event.target.value && d.cultivo === cultivo));
  setDesabilitado(false)
};



    return (
<Container >
<label htmlFor="">Seleccione primero el cultivo y después la variedad del híbrido:</label>

<div style={{ marginTop: '20px' }}>
      <FormControl sx={{ m: 1, minWidth: 100 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Cultivo</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={cultivo}
          onChange={handleChangeCultivo}
          autoWidth
          label="cultivo"
        >
          {cultivosDisponibles.map((cultivo) => (
                            <MenuItem key={cultivo} value={cultivo}>
                                {cultivo}
                            </MenuItem>
                        ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Variedad</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={variedad}
          onChange={handleChangeVariedad}
          autoWidth
          label="variedad"
          disabled={!cultivo}
        >
          {variedadesFiltradas.map((e) => (
                            <MenuItem key={e.variedad} value={e.variedad}>
                                {e.variedad}
                            </MenuItem>
                        ))}
        </Select>
      </FormControl>


    </div>

  <MaterialTable size="small"
      title="Gestión de hibridos"
      data={dataFiltrada}
      columns={columns || []}
      options={{
        actionsColumnIndex: -1,
        maxBodyHeight: maxBodyHeight,
        addRowPosition: "first", 
        padding: onabort,
        paging: false, 
        headerStyle: {
            position: 'sticky', 
            top: 0,
            zIndex: 1,
            backgroundColor: '#fff',
          },
      }}
      icons={{
        Add: () => <AddBox   style={{ fontSize: "25px", color: desabilitado ? "gray" : "white", cursor: desabilitado ? "not-allowed" : "pointer" }}/>, // Cambia el tamaño del ícono de agregar
        Edit: () => <Edit style={{ fontSize: "18px" }} />, // Cambia el tamaño del ícono de editar
        Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />, // Cambia el tamaño y color del ícono de eliminar
    }}
      localization={{
        body: {
          emptyDataSourceMessage: 'No se encontraron hibridos',
          editRow: {
            deleteText: '¿Estás seguro de que deseas eliminar este hibrido?', // Cambia el mensaje de confirmación
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
        isEditable: () => !desabilitado,
        onRowAdd: desabilitado
        ? undefined  
        :  (newData) => {
            return new Promise((resolve, reject) => {
              

              const newDataWithId = {
                ...newData,
                cultivo: cultivo,
                variedad: variedad,
                hibrido: newData.hibrido.toUpperCase(),
                activo: newData.activo !== undefined ? newData.activo : false,
                abreviatura: newData.abreviatura ? newData.abreviatura.toUpperCase() : "",
                descripcion: newData.descripcion ? newData.descripcion.toUpperCase() : "",
                identificador: newData.identificador = "nada"
              }
              console.log("newDataWithId: ",newDataWithId);
             /* hibridoObj.cultivo = "CANA"
              hibridoObj.variedad = "VAR"
              hibridoObj.hibrido = "brif"
              hibridoObj.activo = true
              hibridoObj.abreviatura = "as"
              hibridoObj.descripcion = "mm"
              hibridoObj.identificador = "br"*/

              console.log('Cultivo y variedad asignados:', newDataWithId.cultivo, newDataWithId.variedad);

              const isDuplicate = Array.isArray(data) && data.some(variante => 
                variante.cultivo.toUpperCase() === newDataWithId.cultivo.toUpperCase() &&
                variante.variedad.toUpperCase() === newDataWithId.variedad.toUpperCase() &&
                variante.hibrido.toUpperCase() === newDataWithId.hibrido.toUpperCase()
            );
             
             console.log("¿Es duplicado?", isDuplicate);

             console.log("aaaaa")
              if(isDuplicate){
                showToast('error', 'Ya existe ese hibrido','#9c1010'); 
                reject(`Error al crear el hibrido: ${response.message}`);
                return
              }
             
              hibridosService.create(newDataWithId)
              .then(response => {
                  if (response.success) {
                      console.log("Hibrido creado exitosamente");
                      setData(prevData => [ newDataWithId , ...prevData]);
                      setDataFiltrada(prevData => [...prevData, newDataWithId]);
                      showToast('success', 'Hibrido creado', '#2d800e');
                      resolve();
                  } else {
                      reject(`Error al crear el hibrido: ${response.message}`);
                  }
              })
              .catch(error => {
                  reject(`Error de red: ${error.message}`);
              });

        })
        },
        onRowUpdate: (newData, oldData) => {
            return new Promise((resolve, reject) => {
                const index = data.findIndex(item => item.hibrido === oldData.hibrido);
                const updatedData = [...data];

                const newDataWithId = {
                  ...newData,
                cultivo: cultivo,
                variedad: variedad,
                hibrido: newData.hibrido.toUpperCase(),
                activo: newData.activo !== undefined ? newData.activo : false,
                abreviatura: newData.abreviatura ? newData.abreviatura.toUpperCase() : "",
                descripcion: newData.descripcion ? newData.descripcion.toUpperCase() : "",
                identificador: newData.identificador = "nada"

                  }
                  updatedData[index] = newDataWithId;

                  hibridosService.update(oldData.cultivo, oldData.variedad, oldData.hibrido, newDataWithId) // Asumiendo que `oldData` tiene un campo `id`
                  .then(response => {
                      if (response.success) {
                          setData(updatedData);
                          setDataFiltrada(prevFiltrada => prevFiltrada.map(item => 
                            item.cultivo === oldData.cultivo && item.hibrido === oldData.hibrido && item.variedad === oldData.variedad? newDataWithId : item
                        ));
                          showToast('success', 'hibrido actualizado', '#2d800e');
                          resolve();
                      } else {
                          reject(`Error al actualizar el hibrido: ${response.message}`);
                          showToast('error', '`Error al actualizar el hibrido', '#9c1010');
                      }
                  })
                  .catch(error => {
                      reject(`Error de red: ${error.message}`);
                  });

            })

        },
        onRowDelete: (oldData) => { 
          return new Promise((resolve, reject) => {
            hibridosService.delete(oldData.cultivo, oldData.variedad, oldData.hibrido)
            .then(response => {
                if (response.success) {
                  const dataDelete = data.filter(
                    (el) => !(el.cultivo === oldData.cultivo && el.variedad === oldData.variedad && el.hibrido === oldData.hibrido)
                );
                    setData(dataDelete);
                    setDataFiltrada(prevFiltrada => prevFiltrada.filter(item => 
                      !(item.cultivo === oldData.cultivo && item.variedad === oldData.variedad && item.hibrido === oldData.hibrido)
                  ));

                    showToast('success', 'Hibrido eliminado', '#2d800e');
                    resolve();
                } else {
                 
                  showToast('error', '`Error al eliminar el hibrido', '#9c1010');
                    reject('No se pudo eliminar el hibrido.');
                }
            })
            .catch(error => {
                reject(`Error al eliminar: ${error.message}`);
            });
        });
        },
      }}
 
    />
</Container>
    );
  }
  const Container =styled.div`
  display: block;
  width: 100%;
  max-width: 1100px;
  z-index: 1;
       .MuiToolbar-root {
        background-color: #50ad53; /* Cambia el color del fondo del toolbar */
        color: white; /* Cambia el color del texto del toolbar */
        }
  
    .MuiTableCell-root {
       border-radius: 20px;
       padding: 4px 8px; 
       font-size: 12px !important;
     }
   
     .MuiTableRow-root {
       height: 30px; /* Cambia la altura de las filas */
     }
     .MuiTypography-h6 {
   font-size: 16px; /* Cambia este valor al tamaño deseado */
    }
    @media (max-width: 1200px){
      
    }
    @media (min-width: 1600px) {
      max-width: 1100px;
   .MuiTypography-h6 {
     font-size: 20px; /* Tamaño de fuente para el título en pantallas grandes */
   }
   .MuiTableCell-root {
       padding: 0 8px; 
       font-size: 16px !important;
     }
   }
  `
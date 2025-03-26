import styled from "styled-components";
import Select, { selectClasses } from '@mui/joy/Select';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Option from '@mui/joy/Option';
import { BsCaretDownFill } from "react-icons/bs";
import { BsCaretRightFill } from "react-icons/bs";
import { Delete, Edit, AddBox, Search as SearchIcon } from '@mui/icons-material';
import MaterialTable,  { MTableToolbar } from "@material-table/core";
import React, { useState, useEffect, useRef } from "react";
import { Utils } from "../../models/Utils";
import Button from '@mui/joy/Button';
import { ProductoService } from "../../services/ProductoService";
import { DDTLaboresService } from "../../services/DDTLaboresService";
import { TemporadasService } from "../../services/TemporadasService";
import { ProductosLaborPoService } from "../../services/ProductosLaborPOService";
import { showToast } from "../../components/helpers";

var productoService= new ProductoService();
var ddtLaboresService= new DDTLaboresService();
var temporadaService= new TemporadasService();
var productoLaborPo = new ProductosLaborPoService();

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
    const [productoAsignado, setProductoAsignado] = useState(false);


    const horasAguaRef = useRef(null);
    const horasInyeccionRef = useRef(null);
    const horasLavadoRef = useRef(null);

 

      const columns = [
         { title: 'DDT', field: 'ddt', cellStyle: {fontSize: '12px', padding: '4px 0 4px 9px' } },
         { title: 'N° Siembra', field: 'siembraNumero', cellStyle: {fontSize: '12px', padding: '4px 0 4px 9px'  }},
    ]

    const clearInputs = () => {
      horasAguaRef.current.value =0
      horasInyeccionRef.current.value=0
      horasLavadoRef.current.value=0
    }

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
            Utils.fetchData(ddtLaboresService.getByTemporadaAliasLabor(Utils.getTempActive() ?? "",selectedLabor),
             setData, "ddtLabores").then((resp)=>{
              setDataCopy(resp)
              setDesactivarSiembra(false);});
              setSelectedSiembra("");
              setSelectedDdt(null);
        }else{
          setSelectedSiembra("");
          setSelectedDdt(null);
          setDesactivarSiembra(true);}

          console.log("selectedLabor", selectedLabor)
      }, [selectedLabor]);

      useEffect(() => {
        if(selectedSiembra === ""){
          setData(dataCopy);
          setSelectedDdt(null);
        }
        else{
          const dataFiltered= dataCopy?.filter(d=>d.siembraNumero==selectedSiembra);
          setData(dataFiltered);
          setSelectedDdt(null);
        }
      }, [selectedSiembra]);

      useEffect(() => {
        clearInputs();
        setDataProductosAsignados([]);
        if(selectedDdt && selectedDdt.siembraNumero){

          productoLaborPo.getByTempSiembraNumDepLabAliasDdt(
          selectedDdt?.temporada, selectedDdt?.siembraNumero, selectedDdt?.departamento, 
          selectedDdt?.labor, selectedDdt?.aliasLabor, selectedDdt?.ddt).then(response => {
            if (response.success) {
              setDataProductosAsignados(response.poProductosLabor);
            }
          })


        }

      }, [selectedDdt, productoAsignado]);


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

    const handleAsignarProducto = () => {
      if (!selectedLabor) {
        showToast('error', 'Debe seleccionar un labor', '#9c1010');
        return;
      }
      
      if (!selectedDdt || (Array.isArray(selectedDdt) && !selectedDdt.some(item => item))) {
        showToast('error', 'Debe seleccionar un DDT', '#9c1010');
        return;
      }
    
      if (!selectedProduct || (Array.isArray(selectedProduct) && !selectedProduct.some(item => item))) {
        showToast('error', 'Debe seleccionar un producto', '#9c1010');
        return;
      }
    
      console.log("selectedDdt",selectedDdt)
      // Creación del objeto
      const newProductoAsignado = {
        Temporada: selectedDdt.temporada ?? Utils.getTempActive(),
        SiembraNumero: selectedDdt.siembraNumero,
        Departamento: selectedDdt.departamento ?? "RIEGO Y DRENAJE",
        Labor: selectedDdt.labor,
        AliasLabor: selectedDdt.aliasLabor,
        Ddt: selectedDdt.ddt,
        idProducto: selectedProduct.idProducto,
        NombreDescriptivo: selectedProduct.nombreDescriptivo,
        DosisHa: 0,
        HorasAgua: horasAguaRef.current?.value ?? 0,
        HorasInyeccion: horasInyeccionRef.current?.value ?? 0,
        HorasLavado: horasLavadoRef.current?.value ?? 0,
      };
    
      console.log("Producto a asignar:", newProductoAsignado);
    
      // Llamada al servicio para asignar el producto
      productoLaborPo.create(newProductoAsignado)
        .then(response => {
          if (response.success) {
            setDataProductosAsignados(prevData => [...prevData, { ...newProductoAsignado }]);
            setSelectedProduct(null);
            showToast('success', 'Producto asignado', '#2d800e');
            setProductoAsignado(prev => !prev);
          } else {
            showToast('error', 'No se pudo asignar el producto', '#9c1010');
          }
        })
        .catch(error => {
          showToast('error', `Error al asignar el producto: ${error.message}`, '#9c1010');
        });
    };
    


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
              <Option key={index} value={labor.aliasLabor}>
                {labor.aliasLabor}
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
      selection:true,
      showSelectAllCheckbox: false,
      showTextRowsSelected: false,
      rowStyle: rowData => ({
        backgroundColor: (selectedDdt?.ddt === rowData.ddt && selectedDdt?.siembraNumero === rowData.siembraNumero) ? '#3f842f41' : '#FFF'
      }),

      selectionProps: (rowData) => ({
        onChange: () => {
          console.log("rowData",rowData)
          setSelectedDdt((prevRow) => (prevRow?.ddt === rowData.ddt && prevRow?.siembraNumero === rowData.siembraNumero? null : 
            {temporada:rowData.temporada, departamento:rowData.departamento,labor:rowData.labor, aliasLabor:rowData.aliasLabor, ddt: rowData.ddt,siembraNumero: rowData.siembraNumero })); 

          // console.log("selectedRow",selectedDdt)
        },
        style: { display: 'none' }
      }),

        maxBodyHeight: '12rem',
        actionsColumnIndex: -1,
        paging: false,
        toolbar: false,
        search: false,
        cellStyle: {fontSize: getFontSize(), padding: '4px 0 4px 9px' },
        headerStyle: { position: 'sticky', top: 0,fontSize: getFontSize(), backgroundColor: '#408730', color: 'white' },
    }}

    localization={{
      body: {
        emptyDataSourceMessage: 'No se encontraron DDT',
      }
    }}
    
    onRowClick={(event, rowData) => {
      setSelectedDdt((prevRow) => (prevRow?.ddt === rowData.ddt && prevRow?.siembraNumero === rowData.siembraNumero? null : 
        {temporada:rowData.temporada, departamento:rowData.departamento,labor:rowData.labor, aliasLabor:rowData.aliasLabor, ddt: rowData.ddt,siembraNumero: rowData.siembraNumero })); 
      console.log("selectedRow",selectedDdt)}}
    
    />
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
      selection:true,
      showSelectAllCheckbox: false,
      showTextRowsSelected: false,
      rowStyle: rowData => ({
        backgroundColor: (selectedProduct?.idProducto === rowData.idProducto) ? '#3f842f41' : '#FFF'
      }),

      selectionProps: (rowData) => ({
        onChange: () => {
          
          setSelectedProduct((prevRow) => (prevRow?.idProducto === rowData.idProducto? null : {idProducto: rowData.idProducto, nombreDescriptivo: rowData.nombreDescriptivo, tipoUso: rowData.tipoUso }));

              // console.log("selectedRow",selectedDdt)
        },
        style: { display: 'none' }
      }),

        maxBodyHeight: maxBodyHeight,
        actionsColumnIndex: -1,
        paging: false,
        toolbar: true,
        search: true,
        headerStyle: { position: 'sticky', top: 0, fontSize: getFontSize(), backgroundColor: '#ffffff'},
        cellStyle: {fontSize: getFontSize(), padding: '4px 0 4px 9px' }
    }}

    onRowClick={(event, rowData) => {
      setSelectedProduct((prevRow) => (prevRow?.idProducto === rowData.idProducto ? null : {idProducto: rowData.idProducto, nombreDescriptivo: rowData.nombreDescriptivo, tipoUso: rowData.tipoUso })); 
      console.log("selectedRow",selectedProduct)}}

    style={{ width: "25rem", maxWidth: "600px" }}
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
            ref: index === 0 ? horasAguaRef : index === 1 ? horasInyeccionRef : horasLavadoRef,
            min: 0,
            step: 0.5,
          },
        }}
      />
    </div>
  ))}
   <Button endDecorator={<BsCaretRightFill/>} color="success"
   sx={{fontSize: '12px', padding: '20px 10px', height: '2rem'}} onClick={handleAsignarProducto}
   >
        Asignar Producto
      </Button>
</div>
</div>
<div>
    <MaterialTable
     data={dataProductosAsignados || []}
     title={<div style={{ fontSize: '12px', color: 'white' }}> Productos asignados</div>}
     columns={[{title: 'Nombre del producto', field: 'nombreDescriptivo', editable:"onAdd", headerStyle: {width:"30%"}},
     {title: 'Dosis/Ha', field: 'dosisHa', type:"numeric"},
     {title: 'Horas Agua', field: 'horasAgua',type:"numeric" },
     {title: 'Horas Inyeccion', field: 'horasInyeccion',type:"numeric" },
     {title: 'Horas Lavado', field: 'horasLavado', type:"numeric"}]}
     options={{
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

     icons={{
        Edit: () => <Edit style={{ fontSize: "18px" }} />,
        Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />, 
      }}
  
    components={{
        Toolbar:CustomToolbar,
    }}

    localization={{
      body: {
        emptyDataSourceMessage: 'No se encontraron productos asignados',
        editRow: {
          deleteText: '¿Estás seguro de que deseas eliminar este producto del labor?', // Cambia el mensaje de confirmación
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
        searchPlaceholder: 'Buscar',
      },
    }}

     editable={{
        onRowAddCancelled: (rowData) => console.log("Row adding cancelled"),
        onRowUpdateCancelled: (rowData) => console.log("Row editing cancelled"),
        onRowUpdate: (newData, oldData) => {
          
          return new Promise((resolve, reject) => {
            const index = dataProductosAsignados.findIndex(item => item.temporada === oldData.temporada && 
              item.siembraNumero === oldData.siembraNumero && item.departamento===oldData.departamento
              && item.labor === oldData.labor && item.aliasLabor === oldData.aliasLabor && 
              item.ddt === oldData.ddt && item.idProducto === oldData.idProducto);
              const updatedDataProductPo = [...dataProductosAsignados];
              const newDataWithId = {...newData,}

              console.log("datos a actualizar",newDataWithId)

           updatedDataProductPo[index] = newDataWithId;
           console.log("test")
           console.log("newDataWithId",newDataWithId)
           console.log("oldData",oldData)
                      
           productoLaborPo.update(oldData.temporada,oldData.siembraNumero, oldData.departamento, oldData.labor, 
            oldData.aliasLabor, oldData.ddt, oldData.idProducto, newDataWithId)
           .then(response => {
                   console.log("test")
                     if (response.success) {
                         setDataProductosAsignados(updatedDataProductPo);
                         showToast('success', 'Producto actualizado', '#2d800e');
                         resolve();
                     } else {
                         reject(`Error al actualizar el producto: ${response.message}`);
                         showToast('error', '`Error al actualizar el producto', '#9c1010');
                     }
                 })
                 .catch(error => {
                     reject(`Error de red: ${error.message}`);
                 });
                                                       })
                    },
                    onRowDelete: (oldData) => {
                     
                         return new Promise((resolve, reject) => {

                           productoLaborPo.delete(oldData.temporada, oldData.siembraNumero,oldData.departamento, oldData.labor, 
                            oldData.aliasLabor, oldData.ddt, oldData.idProducto)
                           .then(response => {
                               if (response.success) {
                                setProductoAsignado(false)
                                const dataDelete = dataProductosAsignados.filter((p) =>
                                  !(p.temporada === oldData.temporada && p.siembraNumero === oldData.siembraNumero &&
                                    p.departamento === oldData.departamento && p.labor === oldData.labor && 
                                    p.aliasLabor ===oldData.aliasLabor && p.ddt === oldData.ddt && p.idProducto === oldData.idProducto));
                                     setDataProductosAsignados(dataDelete);
                                   showToast('success', 'Producto eliminado del Programa Operativo', '#2d800e');
                                   resolve();
                               } else {
                                
                                 showToast('error', '`Error al eliminar el producto del Programa Operativo', '#9c1010');
                                   reject('No se pudo eliminar el producto.');
                               }
                           })
                           .catch(error => {
                               reject(`Error al eliminar: ${error.message}`);
                              });
                            });
                    }
                }}
    
    
    />
    </div>
    </Container>
    
    );
 }
 const Container = styled.div`
 gap: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

 gap: 20px;
 .css-ig9rso-MuiToolbar-root{
    padding: 10px;
    min-height: 0;
 }

 @media (max-width: 1200px) {  
    /* flex-direction: column; */
    flex-wrap: wrap;
    }
 `;
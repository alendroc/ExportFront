import styled from "styled-components";  
import MaterialTable from "@material-table/core";  
import React, { useState, useEffect } from "react";  
import { Delete, Edit, AddBox } from '@mui/icons-material';  
import { CertificacionService } from "../../services/CertificacionService";   
import { showToast } from "../../components/helpers";  
import { Autocomplete, TextField } from "@mui/material";
import { ProductoService } from "../../services/ProductoService";


const certificacionService = new CertificacionService();  
const productoService = new ProductoService();



export function Certificaciones() {  
    const [data, setData] = useState([]);  
    const [maxBodyHeight, setMaxBodyHeight] = useState(480);  
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProductos, setSelectedProductos] = useState([]);
    
    const handleProductoChange = (event, newValue) => {  
        setSelectedProductos(newValue); 
      }; 

    const columns = [  
        {
            title: "Producto",
            field: "idProducto",
            editable: "onAdd",
            editComponent: ({ value, onChange }) => (
                <Autocomplete
                    options={productos}  
                    getOptionLabel={(option) => option?.idProducto?.toString() || ""}
                    onChange={(event, newValue) => onChange(newValue?.idProducto || "")}  // Asegurarte de pasar solo el ID
                    renderInput={(params) => (
                        <TextField {...params} label="Selecciona un producto" variant="outlined" />
                    )}  
                />
            ),
                        
            validate: row => {
                if (!row.idProducto) return { isValid: false, helperText: "El producto es obligatorio." };
                return true;
            }
        },
        {  
            title: "Nombre Certificación",   
            field: "nombreCertificacion",  
            editable: 'onAdd', 
            validate: row => {  
                const nombreCertificacion = row.nombreCertificacion || ""; 
                if (nombreCertificacion.length === 0) {  
                    return { isValid: false, helperText: "El nombre de la certificación es obligatorio." };  
                }  
                if(row.nombreCertificacion?.trim() ===""){
                    return {isValid: false,helperText: "No se permite el campo vacío"};
                } 
                if (nombreCertificacion.length > 50) {  
                    return { isValid: false, helperText: "El nombre de la certificación debe tener un máximo de 50 caracteres." };  
                }  
                return true;  
            }  
        },  
        {  
            title: "Ddt Precosecha",   
            field: "ddtPrecosecha",  
            type: "numeric",  
            validate: row => {  
                const ddtPrecosecha = row.ddtPrecosecha || "";  
                const regex = /^\d{8}$/; 
                if (ddtPrecosecha.length === 0) {  
                    return { isValid: false, helperText: "Ddt Precosecha es obligatorio." };  
                }  
                if (!regex.test(ddtPrecosecha)) {  
                    return { isValid: false, helperText: "Formato inválido para Ddt Precosecha (año mes dia)." };  
                }  
                return true;  
            }  
        },  
        {  
            title: "Comentarios",   
            field: "comentarios",  
            validate: row => {  
                const comentarios = row.comentarios || "";   
                if (comentarios.length > 500) {  
                    return { isValid: false, helperText: "El límite de la columna es de 500 caracteres." };  
                }  
                return true;  
            }  
        }  
    ];
    

    useEffect(() => {  
        const fetchData = async () => {  
            try {  
                const response = await certificacionService.getAll();  
                if (response.success) {  
                    //console.log("Certificaciones obtenidos:", response.data);   
                    setData(response.certificaciones);  
                } else {  
                    setData([]);  
                    console.log(response.message);  
                }  
            } catch (error) {  
                showToast('error', error, '#9c1010');  
                console.error("Error al obtener las certificaciones:", error);  
            }  
        };  
        const fetchProductos = async () => {  
            setLoading(true);  
            try {  
                const response = await productoService.getAll();  
                if (response.success) {  
                    console.log("Productos obtenidos:", response);   
                    setProductos(response.productos); 
                } else {  
                    console.log("No se pudieron obtener los productos.");  
                }  
            } catch (error) {  
                console.error("Error al obtener los productos:", error);  
            }  
            setLoading(false);  
        };
      
        fetchProductos();
        fetchData();  
    }, []);  

    return (  
        <Container>  
            <MaterialTable  
                size="small"  
                title="Gestión de Certificaciones"  
                data={data}  
                columns={columns || []}  
                options={{  
                    actionsColumnIndex: -1,  
                    maxBodyHeight: maxBodyHeight,  
                    addRowPosition: "first",  
                    paging: false,  
                    headerStyle: {  
                        position: 'sticky',  
                        top: 0,  
                        zIndex: 1,  
                        backgroundColor: '#fff',  
                    },  
                }}  
                icons={{  
                    Add: () => <AddBox style={{ fontSize: "25px", color: "white" }} />,  
                    Edit: () => <Edit style={{ fontSize: "18px" }} />,  
                    Delete: () => <Delete style={{ fontSize: "18px", color: "red" }} />,  
                }}  
                localization={{  
                    body: {  
                        emptyDataSourceMessage: 'No se encontraron certificaciones',  
                        editRow: {  
                            deleteText: '¿Estás seguro de que deseas eliminar esta certificación?',  
                            cancelTooltip: 'Cancelar',  
                            saveTooltip: 'Confirmar',  
                        },  
                        editTooltip: 'Editar',  
                        deleteTooltip: 'Eliminar',  
                        addTooltip: 'Agregar',  
                    },  
                    header: {  
                        actions: 'Acciones'  
                    }  
                }}  
                editable={{  
                    onRowAdd: (newData) => {
                        return new Promise((resolve, reject) => {
                            const newCertificacion = {
                                ...newData,
                                idProducto: newData.idProducto || selectedProductos?.idProducto || "", // Asegura que se envíe el ID correcto
                            };
                    
                            certificacionService.create(newCertificacion)
                                .then(response => {
                                    if (response.success) {
                                        setData(prevData => [newCertificacion, ...prevData]);
                                        showToast('success', 'Certificación creada', '#2d800e');
                                        resolve();
                                    } else {
                                        reject(`Error al crear la certificación: ${response.message}`);
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                    showToast('error', error, '#9c1010');
                                    reject(`Error de red: ${error.message}`);
                                });
                        });
                    },                    
                    onRowUpdate: (newData, oldData) => {  
                        return new Promise((resolve, reject) => {  
                            certificacionService.update(oldData.idProducto, oldData.nombreCertificacion, newData) // Asegúrate de pasar el nuevo nombre  
                                .then(response => {  
                                    if (response.success) {  
                                        const updatedData = data.map(item =>  
                                            item.idProducto === oldData.idProducto && item.nombreCertificacion === oldData.nombreCertificacion ? { ...item, ...newData } : item  
                                        );  
                                        setData(updatedData);  
                                        showToast('success', 'Certificación actualizada', '#2d800e');  
                                        resolve();  
                                    } else {  
                                        reject(`Error al actualizar la certificación: ${response.message}`);  
                                    }  
                                })  
                                .catch(error => {  
                                    showToast('error', error, '#9c1010');  
                                    reject(`Error de red: ${error.message}`);  
                                });  
                        });  
                    },
                    onRowDelete: (oldData) => {  
                        return new Promise((resolve, reject) => {  
                            certificacionService.delete(oldData.idProducto, oldData.nombreCertificacion)  // Asegúrate de pasar ambos parámetros  
                                .then(response => {  
                                    if (response.success) {  
                                        // Filtrar los datos eliminando la certificación correspondiente  
                                        const dataDelete = data.filter(item =>   
                                            item.idProducto !== oldData.idProducto || item.nombreCertificacion !== oldData.nombreCertificacion  
                                        );  
                                        setData(dataDelete);  
                                        showToast('success', 'Certificación eliminada', '#2d800e');  
                                        resolve();  
                                    } else {  
                                        reject('No se pudo eliminar la certificación.');  
                                    }  
                                })  
                                .catch(error => {  
                                   showToast('error', error, '#9c1010')
                                   resolve() 
                                });  
                        });  
                    },
                }}  
            />  
        </Container>  
    );  
}  

const Container = styled.div`  
    display: block;  
    width: 90%;  
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

    @media (min-width: 1600px) {  
        .MuiTypography-h6 {  
            font-size: 20px; /* Tamaño de fuente para el título en pantallas grandes */  
        }  
        .MuiTableCell-root {  
            padding: 0 8px;   
            font-size: 16px !important;  
        }  
    }  
`;
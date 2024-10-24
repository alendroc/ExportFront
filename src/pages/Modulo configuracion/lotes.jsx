import styled from "styled-components";
import MaterialTable from "@material-table/core";
import React, { useState, useEffect  } from "react";
import { Delete, Edit, AddBox } from '@mui/icons-material';
import { LoteService } from "../../services/LoteService";
import { showToast } from "../../components/helpers";

var loteService = new LoteService;

const columns = [
    { title: "Temporada", field: "temporada", editable: 'onAdd'},
    { title: "Actual", field: "actual", type: "boolean",  },
    { title: "Descripción", field: "descripcion", },
    { title: "Fecha Inicio", field: "fechaInicio", type: "date",  editComponent: props => (
      <input
        type="date"
        value={props.value || ''} // Para manejar el valor actual del input
        onChange={e => props.onChange(e.target.value)}
        style={{     // Ancho del input
        padding: '8px',      // Espaciado interno
        border: '1px solid #ccc',  // Borde gris claro
        borderRadius: '4px', // Bordes redondeados
        fontSize: '14px',    // Tamaño del texto
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',  // Sombra ligera para darle profundidad
        outline: 'none',     // Eliminar el borde azul por defecto al hacer clic
        margin: '5px 0',  }} // Ajusta el ancho del input aquí
      />) },
    { title: "Fecha Final", field: "fechaFin", type: "date",   
    editComponent: props => (
      <input
        type="date"
        value={props.value || ''} // Para manejar el valor actual del input
        onChange={e => props.onChange(e.target.value)}
        style={{     // Ancho del input
        padding: '8px',      // Espaciado interno
        border: '1px solid #ccc',  // Borde gris claro
        borderRadius: '4px', // Bordes redondeados
        fontSize: '14px',    // Tamaño del texto
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',  // Sombra ligera para darle profundidad
        outline: 'none',     // Eliminar el borde azul por defecto al hacer clic
        margin: '5px 0',  }} // Ajusta el ancho del input aquí
      />) },
] || [];
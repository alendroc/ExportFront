import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import {Utils} from '../models/Utils';
import { TemporadasService } from "../services/TemporadasService";
import { showToast } from "../components/helpers";

var temporadaService= new TemporadasService;

export const activacionDialog = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);
    if (newValue) {
      setValue(newValue);
    }
  };

  return {
    open,
    handleClickListItem,
    handleClose,
  };
};


export function ActionDialog({ onClose, open, data, service, ...other }) {
  const [value, setValue] = useState(null);
  const radioGroupRef = useRef(null);
  const [temporadasOpciones, setTemporadasOpciones] = useState(['']);

  useEffect(() => {
   
    if (open) {
      setValue('');
    }
    Utils.fetchData(temporadaService.getTemporadasFechas(), setTemporadasOpciones, 'temporadas');
   
  }, [ open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose(null);
  };

  const handleOk = async () => {
    if (!value) {
      showToast('error', 'Ninguna temporada seleccionada', '#9c1010');
      return;
    }
  
    if (!data || !Array.isArray(data)) {
      showToast('error', 'No hay datos disponibles para copiar', '#9c1010');
      return;
    }
  
    if (!service || typeof service.copiar !== 'function') {
      showToast('error', 'El servicio no está definido correctamente', '#9c1010');
      return;
    }
  
    const copyData = data.map(lote => ({ ...lote, temporada: value }));
  
    try {
      const response = await service.copiar(copyData);
      if (response.success) {
        showToast('success', `Elementos copiados a la temporada ${value}`, '#2d800e');
      } else {
        showToast('error', 'Error al copiar', '#9c1010');
      }
      onClose(value);
    } catch (error) {
      showToast('error', error.message || 'Error inesperado', '#9c1010');
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 300 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Selecciona una temporada</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="acción"
          name="acción"
          value={value}
          onChange={handleChange}
        >
          {temporadasOpciones
            .filter(option => option.temporada !== Utils.getTempActive() && option.temporada|| 'No hay temporada activa')
            .map((option, index)=> (
              <FormControlLabel
                value={option.temporada}
                key={`${option.temporada}-${index}`}
                control={<Radio />}
                label={option.temporada}
              />
            ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleOk}>Pegar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActionDialog;

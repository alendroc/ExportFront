import styled from "styled-components";
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { BsCaretDownFill } from "react-icons/bs";


export function AsignarProducto() { 
    return (
        <Container>
            <div>
            <div className="flex justify-between bg-white  p-2 rounded-md gap-11 text-sm shadow-sm mb-3">
              <h3>Temporada</h3>
              <h3>Departamento</h3>
            </div>
            <div className="flex  rounded-sm gap-11 text-sm">
            <Select
      placeholder="Seleccione un labor"
      indicator={<BsCaretDownFill />}
      sx={{
        
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)',
          },
        },
      }}
    >
      <Option value="cat">Riego y drenaje</Option>
      <Option value="fish">Fish</Option>
      <Option value="bird">Bird</Option>
    </Select>

    <Select
      placeholder="# Siembra"
      indicator={<BsCaretDownFill />}
      sx={{
       width: '8rem',
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)',
          },
        },
      }}
    >
      <Option value="dog">TODAS</Option>
      <Option value="cat">Primera</Option>
      <Option value="fish">Segunda</Option>
      
    </Select>
            </div>
    </div>
        </Container>
    
    );
 }
 const Container = styled.div`
 display: flex;
 gap: 20px;`;
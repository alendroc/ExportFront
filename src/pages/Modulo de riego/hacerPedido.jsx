
import styled from "styled-components";
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { Height } from "@mui/icons-material";

export function HacerPedido() {
    return (
        <Container>
            <div className="bg-green-600 h-10 items-center flex pl-2 text-white">
                <div className="ContenedorFecha gap-4 flex items-center">
                <div className="flex items-center gap-2">
                 <p className="2xl:text-sm text-[12px]">Fecha Inicio</p>
                 <input type="date" className="text-black text-[10px] lg:text-xs px-2 h-7 focus:outline-2 shadow-md rounded-md"/>
                </div>

                <div className="flex items-center gap-2">
                 <p className="2xl:text-sm text-[12px]">Fecha Inicio</p>
                 <input type="date" className="text-black text-[10px] lg:text-xs px-2 h-7 focus:outline-2 shadow-md rounded-md"/>
                </div>
                <button className="bg-blue-100 text-blue-950 font-medium text-[10px] active:bg-blue-300 lg:text-xs px-2 h-7 focus:outline-2 hover:bg-blue-200 rounded-md">Buscar</button>
                <button className="bg-blue-100 text-blue-950 font-medium text-[10px] active:bg-blue-300 lg:text-xs px-2 h-7 focus:outline-2 hover:bg-blue-200 rounded-md">Sugerir</button>
                <button className="bg-blue-100 text-blue-950 font-medium text-[10px] active:bg-blue-300 lg:text-xs px-2 h-7 focus:outline-2 hover:bg-blue-200 rounded-md">Ver boleta</button>
                </div>
            </div>
        </Container>
    )
}
const  Container = styled.div`


`
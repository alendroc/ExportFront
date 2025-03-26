import * as React from 'react';
import styled from 'styled-components';
import { Outlet, useLocation } from 'react-router-dom';
export function Riego() {
  const location = useLocation();
  
    return (
    <Container $hacerPedido={location.pathname === '/riego/hacer-pedidos'}>
      <Outlet/>
    </Container>);
  }
  const Container =styled.div`
  display: flex;
  flex-direction: column; /* Asegúrate de que el contenido se apile */
  padding: ${({ $hacerPedido }) => ($hacerPedido ? "0px" : "14px")};
  `
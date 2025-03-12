import * as React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
export function Riego() {
    return (
    <Container >
      <Outlet/>
    </Container>);
  }
  const Container =styled.div`
  display: flex;
  flex-direction: column; /* Asegúrate de que el contenido se apile */
  padding: 14px;
  `
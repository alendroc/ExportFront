import styled from "styled-components";
import * as React from 'react';
import { Outlet } from 'react-router-dom';
export function  ProgramaO() {
  return (
    <Container className="p-3">
        <Outlet />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column; /* Asegúrate de que el contenido se apile */
  padding: 14px;
  `;

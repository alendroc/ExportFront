import styled from "styled-components";
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
export function Configuracion() {

  /*const navigate = useNavigate();
  useEffect(() => {
    navigate('umc');
  }, [navigate]);
  
  */

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

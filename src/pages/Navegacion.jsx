import styled from "styled-components";
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
export function Navegacion() {
  /*const navigate = useNavigate();
  useEffect(() => {
    navigate('ver');
  }, [navigate]);
   
  */
    return (
    <Container>
      <Outlet />
    </Container>);
  }
  const Container =styled.div`
  height: 100%;
   overflow-y: auto;
  h1{
    margin-bottom: 60px;
  }
  `
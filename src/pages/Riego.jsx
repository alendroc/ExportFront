import * as React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
export function Riego() {
    return (
    <Container>
      <Outlet/>
    </Container>);
  }
  const Container =styled.div`
 
  `
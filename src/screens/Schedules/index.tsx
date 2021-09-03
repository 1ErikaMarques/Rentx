import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from 'styled-components';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { Calendar } from '../../components/Calendar';

import ArrowSvg from '../../assets/arrow.svg';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DataValueContainer,
  DataValue,
  Content,
  Footer,

} from './styles';

export function Schedules(){
  const theme = useTheme();
  return (
    <Container>
      <Header>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>
        <BackButton onPress={() => {}} color={theme.colors.shape}/>
        <Title>
          Escolha uma{'\n'}
          data de inicio e{'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DataValueContainer selected={false}>
              <DataValue>19/09/2021</DataValue>
            </DataValueContainer>
          </DateInfo>
          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DataValueContainer selected={false}>
              <DataValue>19/09/2021</DataValue>
            </DataValueContainer>
          </DateInfo>          
        </RentalPeriod>      
      </Header>
      <Content>
        <Calendar />
      </Content>

      <Footer>
        <Button title="Confirmar"/>
      </Footer>
    </Container>
  );
}
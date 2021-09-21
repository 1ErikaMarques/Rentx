import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

import { StatusBar } from 'react-native';
import { useTheme } from 'styled-components';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { Calendar, DayProps, generateInterval, MarkedDateProps } from '../../components/Calendar';

import { CarDTO } from '../../dtos/CarDTO';

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



interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

interface Params { //tipando paramentro que esta vindo da rota
  car: CarDTO
}

export function Scheduling() {
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  const theme = useTheme();

  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params as Params; //recuperando o carro selecionado

  function handleConfirmRental() {
    navigation.navigate('SchedulingDetails', {//passando o carro e todas as datas delecionadas
      car,
      dates: Object.keys(markedDates)
    });
  }

  function handleBack() {
    navigation.goBack();
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;//quando n tem uma data anterior selecionada seta a data tanto para o inicio, tanto para o fim
    let end = date;

    if (start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];//de
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];//ate

    setRentalPeriod({
      startFormatted: format(new Date(firstDate), 'dd/MM/yyyy'),
      endFormatted: format(new Date(endDate), 'dd/MM/yyyy'),
    })
  }

  return (
    <Container>
      <Header>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <BackButton onPress={handleBack} color={theme.colors.shape} />
        <Title>
          Escolha uma{'\n'}
          data de inicio e{'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DataValueContainer selected={!!rentalPeriod.endFormatted}>{/*!! se torna um valor boolean*/}
              <DataValue>{rentalPeriod.startFormatted}</DataValue>
            </DataValueContainer>
          </DateInfo>
          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DataValueContainer selected={!!rentalPeriod.endFormatted}>
              <DataValue>{rentalPeriod.endFormatted}</DataValue>
            </DataValueContainer>
          </DateInfo>
        </RentalPeriod>
      </Header>
      <Content>
        <Calendar markedDates={markedDates} onDayPress={handleChangeDate} />
      </Content>

      <Footer>
        <Button title="Confirmar" onPress={handleConfirmRental} enabled={!!rentalPeriod.startFormatted} />
      </Footer>
    </Container>
  );
}
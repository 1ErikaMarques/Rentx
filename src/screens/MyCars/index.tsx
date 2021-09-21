import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { AntDesign } from '@expo/vector-icons';

import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';

import { useTheme } from 'styled-components';
import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO;
  startDateFormatted: string;
  endDateFormatted: string;
}

export function MyCars() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const theme = useTheme();

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get('/schedules_byuser?user_id=1');//id do usuario que ira carregar


        setCars(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars()
  }, []);

  return (
    <Container>
      <Header>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <BackButton onPress={handleBack} color={theme.colors.shape} />
        <Title>
          Seus agendamentos,
          estão aqui.
        </Title>
        <SubTitle>
          Conforto, segurança e praticidade.
        </SubTitle>
      </Header>
      {
        loading ? <LoadAnimation /> :
          <Content>
            <Appointments>
              <AppointmentsTitle>Agendamentos Feitos</AppointmentsTitle>
              <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
            </Appointments>
            <FlatList
              data={cars}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <CarWrapper>
                  <Car data={item.car} />
                  <CarFooter>
                    <CarFooterTitle>Período</CarFooterTitle>
                    <CarFooterPeriod>
                      <CarFooterDate>{item.startDateFormatted}</CarFooterDate>
                      <AntDesign
                        name="arrowright"
                        size={20}
                        color={theme.colors.title}
                        style={{ marginHorizontal: 10 }}
                      />
                      <CarFooterDate>{item.endDateFormatted}</CarFooterDate>
                    </CarFooterPeriod>
                  </CarFooter>
                </CarWrapper>
              )}
            />

          </Content>
      }
    </Container>
  );
}
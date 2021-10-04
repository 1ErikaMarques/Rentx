import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { CarDTO } from '../../dtos/CarDTO';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import { api } from '../../services/api';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,

  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
  Footer,
} from './styles';



interface Params { //tipando paramentro que esta vindo da rota
  car: CarDTO;
  dates: string[];
}

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

export function SchedulingDetails() {
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  const theme = useTheme();

  const navigation = useNavigation();
  const route = useRoute();
  const { car, dates } = route.params as Params; //recuperando o carro selecionado e a datas

  const rentTotal = Number(dates.length * car.price);//olhando quantas datas tem no meu intervalo

  async function handleConfirmRental() {
    setLoading(true);
    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`); //pegando os agendamentos de um carro especifico,passando o id para isso

    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,//pegando todas as datas que ja extao agendadas//no axios a resposta as datas vem dentro de um obj chamado data
      ...dates, //+ as novas datas que foram selecionadas na tela anterior
    ];

    await api.post('schedules_byuser', {
      user_id: 1,
      car,
      startDateFormatted: format(new Date(dates[0]), 'dd/MM/yyyy'),
      endDateFormatted: format(new Date(dates[dates.length - 1]), 'dd/MM/yyyy')
    });

    api.put(`/schedules_bycars/${car.id}`, {
      id: car.id,
      unavailable_dates//dados que foram atualizados
    })
      .then(() => {
        navigation.navigate('Confirmation', { //pegando a resposta da promessa, que sao os dados e redirecionando para a tela SchedulingComplete
          nextScreenRoute: 'Home',
          title: 'Carro alugado',
          message: `Agoravocê so precisa ir\naté uma concessionária da RENTX\npegar seu automóvel.`
        })
      })

      .catch(() => {
        setLoading(false);
        Alert.alert('Não foi possivel confirmar o agendamento.');
      });
  }


  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    setRentalPeriod({
      startFormatted: format(new Date(dates[0]), 'dd/MM/yyyy'), //pegando a primeira data e convertendo
      endFormatted: format(new Date(dates[dates.length - 1]), 'dd/MM/yyyy'),//-1 para q va ate a ultima posicao
    })
  }, [])

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBack} />
      </Header>

      <CarImages>
        <ImageSlider
          imagesUrl={car.photos}
        />
      </CarImages>
      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>R${car.price}</Price>
          </Rent>
        </Details>

        <Accessories>
          {
            car.accessories.map(accessory => (
              <Accessory
                key={accessory.type} //smp quando lidamos com listas colocamos uma key, para que o react lide de maneira mais performatica
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
              />
            ))
          }
        </Accessories>

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>de</DateTitle>
            <DateValue>{rentalPeriod.startFormatted}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(10)}
            color={theme.colors.text}
          />

          <DateInfo>
            <DateTitle>até</DateTitle>
            <DateValue>{rentalPeriod.endFormatted}</DateValue>
          </DateInfo>
        </RentalPeriod>
        <RentalPrice>
          <RentalPriceLabel>Total</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>
      <Footer>
        <Button
          title="Alugar Agora"
          color={theme.colors.success}
          onPress={handleConfirmRental}
          enabled={!loading}
          loading={loading}
        />
      </Footer>
    </Container>
  );
}
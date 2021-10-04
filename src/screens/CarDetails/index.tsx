import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { MaterialIcons } from '@expo/vector-icons';

import
Animated,
{
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';



import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { BorderlessButton, RectButton } from 'react-native-gesture-handler';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

import { CarDTO } from '../../dtos/CarDTO';


import { getAccessoryIcon } from '../../utils/getAccessoryIcon'


import { useTheme } from 'styled-components';
import {
  Container,
  Header,
  CarImages,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer,
} from './styles';

interface Params { //tipando paramentro que esta vindo da rota
  car: CarDTO
}

export function CarDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { car } = route.params as Params;

  const theme = useTheme();

  const scrollVertical = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => { //hook para identificar quando o usuario esta fazendo scoll na tela, o event e quando o usuario movimenta a tela
    scrollVertical.value = event.contentOffset.y; //dentro do event pega a posicao do scoll y, e  seta o novo valor
  });

  const headerStyleAnimation = useAnimatedStyle(() => { //estilo do header de acordo com a animacao do scroll
    return {
      height: interpolate( //animacao nao ir de uma vez e sim gradativamente
        scrollVertical.value,
        [0, 200],
        [200, 70],
        Extrapolate.CLAMP
      ),
    }
  });

  const sliderCarsStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollVertical.value,
        [0, 150], //quando o scroll atingir 150 opacidade 0
        [1, 0],
        Extrapolate.CLAMP
      )
    }
  })

  function handleConfirmRental() {
    navigation.navigate('Scheduling', { car });
  }

  function handleBack() {
    navigation.goBack();
  }

  return (
    <Container>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />


      <Animated.View
        style={[headerStyleAnimation,
          styles.header,
          { backgroundColor: theme.colors.background_secondary }
        ]}>

        <Header>
          <ButtonAnimated onPress={handleBack} />
          <MaterialIcons name="chevron-left" size={24} color={theme.colors.text} />
        </Header>

        <Animated.View style={sliderCarsStyleAnimation}>
          <CarImages>
            <ImageSlider
              imagesUrl={car.photos}
            />
          </CarImages>

        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: getStatusBarHeight() + 160,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler} //onScroll e disparado toda vez q o usuario rola o scroll
        scrollEventThrottle={16} //quantos frames serao renderizados por segundo, evita da animacao ficar travando// 1000 milisegundos / 60 = 16 -> animacao fica sendo de 60 frames por segundo, se tornando mais fluida
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>

        <Accessories>
          {
            car.accessories.map(accessory => (
              <Accessory
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)} />
            ))
          }
        </Accessories>
        <About>{car.about}</About>
        <About>{car.about}</About>
        <About>{car.about}</About>
        <About>{car.about}</About>
        <About>{car.about}</About>
        <About>{car.about}</About>
      </Animated.ScrollView>

      <Footer>
        <Button title="Escolher periodo do aluguel" onPress={handleConfirmRental} />
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    overflow: 'hidden',//se o carro n couber no header, nao mostrar
    zIndex: 1,
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    marginLeft: 24,
  }
})

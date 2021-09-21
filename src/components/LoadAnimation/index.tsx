import React from 'react';
import LottieView from 'lottie-react-native';

import loadingCar from '../../assets/load_car_animated.json';

import {
  Container
} from './styles';

export function LoadAnimation() {
  return (
    <Container>
      <LottieView
        source={loadingCar}
        style={{ height: 200 }}
        resizeMode="contain" //indepente do tamanho da img ele ira ajutar smp
        autoPlay//para executar
        loop={true} //garanti q a animacao n pare
      />

    </Container>
  );
}
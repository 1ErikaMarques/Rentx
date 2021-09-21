import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';

import BrandSvg from '../../assets/brand.svg';
import LogoSvg from '../../assets/logo.svg';

import
Animated,
{
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS
}
  from 'react-native-reanimated';

import {
  Container
} from './styles';


export function Splash() {
  const splashAnimation = useSharedValue(0);

  const navigation = useNavigation();

  const brandStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value,
        [0, 50], //em qual momento da animacao
        [1, 0] //opacidade 
      ),
      transform: [
        {
          translateX: interpolate(splashAnimation.value,
            [0, 50],
            [0, -50], //se mover para o lado
            Extrapolate.CLAMP
          )
        }
      ]
    }
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value,
        [0, 25, 50],
        [0, .3, 1],
      ),
      transform: [
        {
          translateX: interpolate(splashAnimation.value,
            [0, 50],
            [-50, 0],
            Extrapolate.CLAMP
          )
        }
      ]
    }
  });

  function startApp() {
    navigation.navigate('Home');
  }

  useEffect(() => {
    splashAnimation.value = withTiming(
      50, // intervalo da animacao vai de 0 -> 50 steps
      { duration: 2000 },
      () => { //callback
        'worklet'
        runOnJS(startApp)(); //redirecionando o fluxo para thread
      }
    );
  }, []);

  return (
    <Container>
      <Animated.View style={[brandStyle, { position: 'absolute' }]}>
        <BrandSvg width={80} height={50} />
      </Animated.View>

      <Animated.View style={[logoStyle, { position: 'absolute' }]}>
        <LogoSvg width={180} height={20} />
      </Animated.View>
    </Container>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import { StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { PanGestureHandler, RectButton } from 'react-native-gesture-handler';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';

import { database } from '../../database';
import { api } from '../../services/api';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring
} from 'react-native-reanimated';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

import Logo from '../../assets/logo.svg';
import { CarDTO } from '../../dtos/CarDTO';

import { Car } from '../../components/Car';
import { Car as ModelCar } from '../../database/model/Car'
import { LoadAnimation } from '../../components/LoadAnimation';

import { useTheme } from 'styled-components';
import {
  Container,
  Header,
  HeaderContent,
  TotalCars,
  CarList,
} from './styles';



export function Home() {
  const [cars, setCars] = useState<ModelCar[]>([]);
  const [loading, setLoading] = useState(true);

  const positionVertical = useSharedValue(0);
  const positionHorizontal = useSharedValue(0);

  const myCarsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: positionHorizontal.value },
        { translateY: positionVertical.value },
      ]
    }
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: any) { //usuario apertou o btn,componente...//ctx -> contexto
      ctx.positionX = positionHorizontal.value; //criando o position x dentro do contexto,para armazenar o ponto de partida e soma-los com os proximos
      ctx.positionY = positionVertical.value;
    },
    onActive(event, ctx: any) { //enquanto arrasta pela tela //recuperando os valores atuais
      positionHorizontal.value = ctx.positionX + event.translationX;//assim ele parti da onde ele estava e n volta para o inicio
      positionVertical.value = ctx.positionY + event.translationY;
    },
    onEnd() { //quando solta o componente
      positionHorizontal.value = withSpring(0); //quando solta, volta para a posicao inicial//withSpring so faz o efeito visual
      positionVertical.value = withSpring(0);
    }
  });

  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const theme = useTheme();

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car })
  }

  function handleOpenMyCars() {
    navigation.navigate('MyCars');
  }

  //sincronizado dados
  async function offlineSynchronize() {
    await synchronize({
      //conectando com o banco de dados
      database,

      //recuperar do backend as atualizacoes que foram realizadas pelo proprio
      //@param ultima atualizacao que foi feita pelo backend
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api
          //devolve um obj com os carros atualizados
          .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`); //se o banco n vou sincronizado anteriormente ele pode retornar null por isso passamos o 0
        const { changes, latestVersion } = response.data;
        return { changes, timestamp: latestVersion }//as mudancas e a data da ultima atualizacao
      },

      //envia para o backend as mudancas que foram feitas pelo usuario quando ele estava offline 
      // @param quais as mudancas foram realizadas pelo usuario      
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post('/users/sync', user)
      },
    });
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchCars() {
      try {
        const carCollection = database.get<ModelCar>('cars');
        const cars = await carCollection.query().fetch();

        if (isMounted) {//o estado so sera atualizado se o componente/interface estiver montado
          setCars(cars);
        }
      } catch (error) {
        console.log(error);
      } finally {//independente se deu certo ou errado
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    fetchCars();
    return () => { //funcao de limpeza
      isMounted = false
    }
  }, []);

  /*useEffect(() => {
    observa se o usuario esta conectado
    if (netInfo.isConnected) {
      Alert.alert('Voce esta On-line');
    } else {
      Alert.alert('Voce esta offline');
    }
  }, [netInfo.isConnected]) //assim quando a conexao mudar o useEffect sera disparado*/

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <HeaderContent>
          <Logo
            width={RFValue(108)}
            height={RFValue(12)}
          />
          {
            !loading && //se ja tiver terminado de carregar entao mostra o componente
            <TotalCars>
              Total de {cars.length} carros
            </TotalCars>
          }
        </HeaderContent>
      </Header>
      {loading ? <LoadAnimation /> :
        <CarList
          data={cars}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Car data={item} onPress={() => handleCarDetails(item)} />}
        />
      }
      {/*identifica quando o usuario segura e arrasta*/}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[
          myCarsButtonStyle,
          {
            position: 'absolute',
            bottom: 13,
            right: 22
          }
        ]}
        >
          <ButtonAnimated
            onPress={handleOpenMyCars}
            style={[styles.button, { backgroundColor: theme.colors.main }]}
          >
            <Ionicons name="ios-car-sport" size={32} color={theme.colors.shape} />
          </ButtonAnimated>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
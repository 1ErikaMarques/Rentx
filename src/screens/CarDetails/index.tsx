import React from 'react';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import speedSvg from '../assets/speed.svg';
import accelerationSvg from '../assets/acceleration.svg';
import forceSvg from '../assets/force.svg';
import gasolineSvg from '../assets/gasoline.svg';
import exchangeSvg from '../assets/exchange.svg';
import peopleSvg from '../assets/people.svg';

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
  About,
  Accessories,
  Footer,
} from './styles';

export function CarDetails(){
  return (
    <Container>
      <Header>
        <BackButton onPress={() => {}}/>
      </Header>

      <CarImages>
        <ImageSlider 
        imagesUrl={['https:/freepngimg.com/thumb/audi/35227-5-audi-rs5-red.png']}
        />
      </CarImages>
      <Content>
        <Details>
          <Description>
            <Brand>Peugeot</Brand>
            <Name>3008</Name>
          </Description>

          <Rent>
            <Period>Ao dia</Period>
            <Price>R$ 80</Price>
          </Rent>
        </Details>

        <Accessories>
          <Accessory name="200Km/h" icon={speedSvg} />
          <Accessory name="8.9s" icon={accelerationSvg} />
          <Accessory name="130 HP" icon={forceSvg} />
          <Accessory name="Gasolina" icon={gasolineSvg} />
          <Accessory name="Auto" icon={exchangeSvg} />
          <Accessory name="4 pessoas" icon={peopleSvg} />
        </Accessories>
        <About>
          O PEUGEOT i-Cockpit® 2.0 disponibiliza uma vasta gama de tecnologias inovadoras 
          que foram concebidas para aprimorar o seu conforto e segurança. 
          Graças ao eficiente motor Turbo THP 165, você vai se sentir confortável ao volante 
          deste ágil veículo e sentir um incomparável prazer de condução.
        </About>
      </Content>
      <Footer>
        <Button title="Confirmar" />
      </Footer>
    </Container>
  );
}
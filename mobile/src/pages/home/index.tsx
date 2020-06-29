import React, {useState, useEffect} from 'react';
import {Feather as Icon} from '@expo/vector-icons'
import { View, ImageBackground, Image, StyleSheet, Text, TextInput } from 'react-native';
import axios from 'axios'
import {RectButton} from 'react-native-gesture-handler'
import {useNavigation} from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';

interface IBGEUFresponse {
  sigla: string;
}

interface IBGECityresponse {
  nome: string;
}

const Home: React.FC = () => {
  const [uf, setUf] = useState<string[]>([])
  const [city, setCity] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const navigation = useNavigation()

  useEffect(() => {
    axios.get<IBGEUFresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla).sort()
      
      setUf(ufInitials)
    })
  }, []) 

  function handleNavigate() {    
    console.log(selectedUf);
    console.log(selectedCity);
    
    navigation.navigate('Points', {
      selectedUf,
      selectedCity
    })
  }

  function handleSelectUF(uf: string) {
    axios
    .get<IBGECityresponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
    .then(response => {
      
      const cities = response.data.map(city => city.nome).sort()
      
      setCity(cities)
      setSelectedUf(uf)
    })
  }

  const placeholderUF = {
    label: 'Selecione a UF',
    value: null,
  };
  
  const placeholderCity = {
    label: 'Selecione a cidade',
    value: null,
  };

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{width: 274, height: 368}}>
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>
        {/* <TextInput 
          style={styles.input} 
          placeholder="Digite a UF"
          maxLength={2}
          autoCapitalize="characters"
          value={uf}
          onChangeText={setUf}
        /> */}

        <RNPickerSelect
          onValueChange={handleSelectUF}
          placeholder={placeholderUF}
          style={{
            inputAndroid: {
              fontSize: 16,
              color: "#555",
              height: 56,
              backgroundColor: "#FFF",
              borderRadius: 14,
              marginBottom: 8,
              paddingHorizontal: 24,
            },
            iconContainer: {
              top: 15,
              right: 15,
            },
          }}
          items={uf.map((ufItem) => {
            return {
              label: ufItem,
              value: ufItem,
            };
          })}
          Icon={() => {
            return <Icon name="chevron-down" size={24} color="black" />;
          }}
        />

        {/* <TextInput 
          style={styles.input} 
          placeholder="Digite a cidade"
          value={city}
          onChangeText={setCity}
        /> */}

        <RNPickerSelect
          onValueChange={(value) => setSelectedCity(value)}
          placeholder={placeholderCity}
          style={{
            inputAndroid: {
              fontSize: 16,
              color: "#555",
              height: 56,
              backgroundColor: "#FFF",
              borderRadius: 14,
              marginBottom: 8,
              paddingHorizontal: 24,
            },
            iconContainer: {
              top: 15,
              right: 15,
            },
          }}
          items={city.map((cityItem) => {
            return {
              label: cityItem,
              value: cityItem,
            };
          })}
          Icon={() => {
            return <Icon name="chevron-down" size={24} color="black" />;
          }}
        />

        <RectButton style={styles.button} onPress={handleNavigate}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f0f0f5'
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  picker: {
    borderColor: '#949'
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
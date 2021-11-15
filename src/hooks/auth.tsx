import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { api } from '../services/api';
import { database } from '../database';
import { User as ModelUser } from '../database/model/User';

interface User {
  id: string;//do watermelon
  user_id: string;// da api do axios
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
  token: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData { //oq sera compartilhado atraves do contexto
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);//estado inicial e o tipo

function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<User>({} as User)

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/sessions', {
        email,
        password
      });

      const { token, user } = response.data;
      api.defaults.headers.authorization = `Bearer ${token}`;//acrescentando cabecalho na api, todas as requisicoes que o user fizer, tera esse token de autorizacao

      //cadastrando o usuario no nosso banco de dados local
      const userCollection = database.get<ModelUser>('users');//selecionanda a tabela
      await database.write(async () => {//toda insercao de dados no watermelon tem q ser feita dentro de um write
        await userCollection.create((newUser) => { //mandado a resposta da api do axios para o banco
          newUser.user_id = user.id,
            newUser.name = user.name,
            newUser.email = user.email,
            newUser.driver_license = user.driver_license,
            newUser.avatar = user.avatar,
            newUser.token = user.token
        })
      });

      setData({ ...user, token });

    } catch (error: any) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    async function loadUserData() {
      //buscando se o usuario esta logado
      const userCollection = database.get<ModelUser>('users');
      const response = await userCollection.query().fetch();
      //atualiza o estado com os dados do usuario logado 
      if (response.length > 0) {
        const userData = response[0]._raw as unknown as User;
        api.defaults.headers.authorization = `Bearer ${userData.token}`;
        setData(userData);
      }
    }
    loadUserData();
  });

  return (
    <AuthContext.Provider value={{ user: data, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
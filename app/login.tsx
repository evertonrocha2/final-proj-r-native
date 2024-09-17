import Modal from "@/components/modal";
import TextInput from "@/components/textInput";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const { login } = useAuth();

  const handleSubmit = () => {
    login(email, senha);
    router.replace("/(tabs)");
  };



  return (
    <View style={{ padding: 0, height: '100%', backgroundColor: 'white', justifyContent: 'center' }}>

      <View style={{ padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Text style={{ fontSize: 40, letterSpacing: -2, textAlign: 'center' }}>Bem vinda,</Text>
        <Text style={{ fontSize: 20, letterSpacing: -1, textAlign: 'center', fontWeight: '600', marginBottom: 40 }}>Entre para acessar o Sistema!</Text>
        <View style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Text style={{ fontWeight: '600', letterSpacing: -1 }}>Digite o seu e-mail</Text>
            <TextInput style={{ backgroundColor: '#DDFFC2', borderRadius: 0 }} value={email} onChangeText={(e: string) => setEmail(e)} />
          </View>
          <View style={{ display: 'flex', flexDirection: 'column', gap: 4, }}>
            <Text style={{ fontWeight: '600', letterSpacing: -1 }}>Digite a sua senha</Text>
            <TextInput style={{ backgroundColor: '#DDFFC2', borderRadius: 0 }} value={senha} onChangeText={(e: string) => setSenha(e)} />
          </View>
        </View>
        <Button textColor="#DDFFC2" style={{ backgroundColor: '#000000', width: '40%', height: 50, borderRadius: 0, margin: 'auto', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            handleSubmit();
          }
          }>Entrar</Button>
      </View>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <Text onPress={() => router.push('/recuperar-senha')} style={{ color: 'blue', textDecorationLine: 'underline' }}>
          Esqueceu a senha?
        </Text>
      </View>

    </View >
  );
};




export default Login;

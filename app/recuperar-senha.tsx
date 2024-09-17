import Button from "@/components/button";
import TopBar from "@/components/navigation/topbar";
import TextInput from "@/components/textInput";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

const RecuperarSenha = () => {
    const [emailRecuperacao, setEmailRecuperacao] = useState<string>("");

    const handleForgotPassword = () => {
        console.log("Enviar e-mail para:", emailRecuperacao);
    };


    return (
        <View>
            <TopBar title="Recuperar Senha" />
            <View style={{ padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Recuperar senha</Text>
                    <TextInput
                        style={{ backgroundColor: '#DDFFC2', borderRadius: 0 }}
                        placeholder="Digite seu e-mail"
                        value={emailRecuperacao}
                        onChangeText={(e: string) => setEmailRecuperacao(e)}
                    />

                    <Button
                        mode="contained"
                        onPress={handleForgotPassword}
                        style={{ marginTop: 20, backgroundColor: '#000' }}
                    >
                        Enviar
                    </Button>
                    <Button textColor="black" style={{ width: '40%', height: 40, borderRadius: 0, margin: 'auto', marginTop: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'start', }}
                        onPress={() => {
                            router.push('/login');
                        }
                        }><Text style={{ fontSize: 15 }}>

                            Voltar para o Login

                        </Text>
                    </Button>
                </View>
            </View >

        </View >
    );
};

export default RecuperarSenha;
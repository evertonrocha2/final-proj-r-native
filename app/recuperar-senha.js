import Button from "@/components/button";
import TopBar from "@/components/navigation/topbar";
import TextInput from "@/components/textInput";
import { auth } from "@/infra/firebase";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";

const RecuperarSenha = () => {
    const [emailRecuperacao, setEmailRecuperacao] = useState("");

    const handleForgotPassword = () => {
        sendPasswordResetEmail(auth, emailRecuperacao);
        alert("E-mail enviado com sucesso!");
        setEmailRecuperacao("");
    };

    const colors = useTheme()


    return (
        <View>
            <TopBar title="Recuperar Senha" />
            <View style={{ padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Recuperar senha</Text>
                    <TextInput
                        style={{ backgroundColor: colors.colors.background, borderRadius: 0 }}
                        placeholder="Digite seu e-mail"
                        value={emailRecuperacao}
                        onChangeText={(e) => setEmailRecuperacao(e)}
                    />

                    <Button
                        mode="contained"
                        onPress={handleForgotPassword}
                        textColor={colors.colors.onPrimary}
                        style={{ marginTop: 20, backgroundColor: colors.colors.primary }}
                    >
                        Enviar
                    </Button>
                    <Button textColor={colors.colors.primary}style={{ width: '40%', height: 40, borderRadius: 0, margin: 'auto', marginTop: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'start', }}
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
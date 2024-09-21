import TopBar from "@/components/navigation/topbar";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Fab from "@/components/fab";
import TextInput from "@/components/textInput";
import {
    initializeDatabase,
    inserirFraldas,
    reduzirFraldas,
    buscarEstoque
} from "@/services/db";
import * as SQLite from "expo-sqlite";

import Grid from "@/components/grid";
import { obterOuCriarEstoqueUsuario, atualizarEstoqueTotalUsuario} from "../../infra/fraldas"; // Importação do Firebase
import { auth } from "@/infra/firebase";
import { useFraldas } from "@/context/FraldasContext";

const Gerenciador = () => {
    const { quantidadeFraldas, setQuantidadeFraldas } = useFraldas();
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [inputQuantidade, setInputQuantidade] = useState<string>("");

    const colors = useTheme();
    const userId = auth.currentUser?.uid; 

    useEffect(() => {
        const initialize = async () => {
            const dbInstance = await initializeDatabase();
            setDb(dbInstance);
            const { quantidadeFraldas} = await buscarEstoque(dbInstance);
            setQuantidadeFraldas(quantidadeFraldas);

            const estoqueFirebase = await obterOuCriarEstoqueUsuario(userId); 
            if (estoqueFirebase.estoqueTotal !== quantidadeFraldas) {
                setQuantidadeFraldas(estoqueFirebase.estoqueTotal);
                await inserirFraldas(dbInstance, estoqueFirebase.estoqueTotal);
            }
        };
        initialize();
    }, [userId]);

    const salvarQuantidade = async () => {
        const novaQuantidade = parseInt(inputQuantidade, 10);
        if (isNaN(novaQuantidade) || !db) return;
        const novaEstoqueTotal = quantidadeFraldas + novaQuantidade;
        await inserirFraldas(db, novaEstoqueTotal);
        setQuantidadeFraldas(novaEstoqueTotal);
        await atualizarEstoqueTotalUsuario(userId, novaQuantidade); 
        setInputQuantidade("");
    };

    const atualizarEstoque = async (novaQuantidade: number) => {
        const quantidadeAtual = quantidadeFraldas; 
        const novaQuantidadeTotal = quantidadeAtual + novaQuantidade; 
        //@ts-ignore
        await inserirFraldas(db, novaQuantidadeTotal); 
        setQuantidadeFraldas(novaQuantidadeTotal); 
        await atualizarEstoqueTotalUsuario(userId, novaQuantidade); 
    };

    return (
        <ScrollView>
            <View>
        <Grid style={{ backgroundColor: colors.colors.background, height: '100%' }}>
            <TopBar title="Gerenciador de Estoque" />
            <Grid>
                <Grid style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10, backgroundColor: colors.colors.secondary, padding: 30, borderRadius: 5 }}>
                    <Text style={{ color: colors.colors.onPrimary, fontSize: 20, letterSpacing: -1, textAlign: "center" }}>Altere o estoque de Fraldas</Text>
                    <Text style={{color: colors.colors.onPrimary, fontSize: 30, letterSpacing: -1, textAlign: "center", fontWeight: 700 }}>Aumente ou reduza a quantidade atual de fraldas!</Text>
                </Grid>

                <View style={{ marginTop: 35 }}>
                    <Text style={{color: colors.colors.onBackground, fontSize: 28, fontWeight: 700, textAlign: "center" }}>Quantidade Total de Fraldas</Text>
                </View>

                <View style={{ backgroundColor: colors.colors.primary, display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 20, gap: 20, width: 400, marginLeft: "auto", marginRight: "auto", padding: 30, borderRadius: 5 }}>
                    <View><Text style={{color: colors.colors.onPrimary, fontSize: 20, fontWeight: 600 }}>{quantidadeFraldas}</Text></View>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 2 }}>
                        <Fab style={{ backgroundColor: colors.colors.primary }} icon="plus" onPress={async () => {
                            await atualizarEstoque(1);
                        }} />
                        <Fab style={{ backgroundColor: colors.colors.primary }} icon="minus" onPress={async () => {
                            //@ts-ignore
                            await reduzirFraldas(db, quantidadeFraldas - 1);
                            const novaQuantidade = quantidadeFraldas - 1;
                            setQuantidadeFraldas(novaQuantidade);
                            await atualizarEstoqueTotalUsuario(userId, -1);
                        }} />
                    </View>
                    <View style={{ padding: 20 }}>
                        <TextInput
                            value={inputQuantidade}
                            onChangeText={setInputQuantidade}
                            keyboardType="numeric"
                            textColor={colors.colors.onBackground}
                            style={{ marginBottom: 10, backgroundColor: colors.colors.onPrimary, borderRadius: 5, padding: 10 }}
                        />
                        <Button mode="contained" onPress={salvarQuantidade}>Salvar</Button>
                    </View>
                </View>
            </Grid>
        </Grid>
        </View>
        </ScrollView>
    );
};

export default Gerenciador;

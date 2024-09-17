import TopBar from "@/components/navigation/topbar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Fab from "@/components/fab";
import TextInput from "@/components/textInput";
import {
    initializeDatabase,
    inserirFraldas,
    inserirFraldasMes,
    reduzirFraldas,
    reduzirFraldasMes,
    buscarEstoque
} from "@/services/db";
import * as SQLite from "expo-sqlite";


const Gerenciador = () => {
    const [quantidadeFraldas, setQuantidadeFraldas] = useState(0);
    const [compradasMes, setCompradasMes] = useState(0);
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [inputQuantidade, setInputQuantidade] = useState<string>("");
    const [inputQuantidade2, setInputQuantidade2] = useState<string>("");

    useEffect(() => {
        const initialize = async () => {
            const dbInstance = await initializeDatabase();
            setDb(dbInstance);

            const { quantidadeFraldas, compradasMes } = await buscarEstoque(dbInstance);
            setQuantidadeFraldas(quantidadeFraldas);
            setCompradasMes(compradasMes);
        };

        initialize();
    }, []);

    const salvarQuantidade = async () => {
        const novaQuantidade = parseInt(inputQuantidade, 10);
        if (isNaN(novaQuantidade) || !db) return;

        await inserirFraldas(db, quantidadeFraldas + novaQuantidade);
        setQuantidadeFraldas(quantidadeFraldas + novaQuantidade);
        setInputQuantidade("");
    };

    const salvarQuantidadeCompradas = async () => {
        const novaQuantidade = parseInt(inputQuantidade2, 10);
        if (isNaN(novaQuantidade) || !db) return;

        await inserirFraldasMes(db, compradasMes + novaQuantidade);
        setCompradasMes(compradasMes + novaQuantidade);
        setInputQuantidade2("");
    };

    return (
        <View>
            <TopBar title="Gerenciador de Estoque" />
            <View>
                <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10, backgroundColor: "#EEFFE0", padding: 30, borderRadius: 5 }}>
                    <Text style={{ fontSize: 20, letterSpacing: -1, textAlign: "center" }}>Altere o estoque de Fraldas</Text>
                    <Text style={{ fontSize: 30, letterSpacing: -1, textAlign: "center", fontWeight: 700 }}>Aumente ou reduza a quantidade atual de fraldas!</Text>
                </View>

                <View style={{ marginTop: 35 }}>
                    <Text style={{ fontSize: 28, fontWeight: 700, textAlign: "center" }}>Quantidade Total de Fraldas</Text>
                </View>

                <View style={{ backgroundColor: "#DDFFC2", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 20, gap: 20, width: 400, marginLeft: "auto", marginRight: "auto", padding: 30, borderRadius: 5 }}>
                    <View><Text style={{ fontSize: 20, fontWeight: 600 }}>{quantidadeFraldas}</Text></View>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 2 }}>
                        <Fab style={{ backgroundColor: "#DDFFC2" }} icon="plus" onPress={() => {
                            const novaQuantidade = quantidadeFraldas + 1;
                            //@ts-ignore
                            inserirFraldas(db, novaQuantidade);
                            setQuantidadeFraldas(novaQuantidade);
                        }} />
                        <Fab style={{ backgroundColor: "#DDFFC2" }} icon="minus" onPress={() => {
                            const novaQuantidade = quantidadeFraldas - 1;
                            //@ts-ignore
                            reduzirFraldas(db, novaQuantidade);
                            setQuantidadeFraldas(novaQuantidade);
                        }} />
                    </View>
                    <View style={{ padding: 20 }}>
                        <TextInput
                            value={inputQuantidade}
                            onChangeText={setInputQuantidade}
                            keyboardType="numeric"
                            style={{ marginBottom: 10, backgroundColor: "#EEFFE0", borderRadius: 5, padding: 10 }}
                        />
                        <Button mode="contained" onPress={salvarQuantidade}>Salvar</Button>
                    </View>
                </View>

                <View style={{ marginTop: 35 }}>
                    <Text style={{ fontSize: 28, fontWeight: 700, textAlign: "center" }}>Fraldas compradas este mês</Text>
                </View>

                <View style={{ backgroundColor: "#FFEDD9", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 20, gap: 20, width: 400, marginLeft: "auto", marginRight: "auto", padding: 30, borderRadius: 5 }}>
                    <View><Text style={{ fontSize: 20, fontWeight: 600 }}>{compradasMes}</Text></View>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 2 }}>
                        <Fab style={{ backgroundColor: "#FFEDD9" }} icon="plus" onPress={() => {
                            const novaQuantidade = compradasMes + 1;
                            //@ts-ignore
                            inserirFraldasMes(db, novaQuantidade);
                            setCompradasMes(novaQuantidade);
                        }} />
                        <Fab style={{ backgroundColor: "#FFEDD9" }} icon="minus" onPress={() => {
                            const novaQuantidade = compradasMes - 1;
                            //@ts-ignore
                            reduzirFraldasMes(db, novaQuantidade);
                            setCompradasMes(novaQuantidade);
                        }} />
                    </View>
                    <View style={{ padding: 20 }}>
                        <TextInput
                            value={inputQuantidade2}
                            onChangeText={setInputQuantidade2}
                            keyboardType="numeric"
                            style={{ marginBottom: 10, backgroundColor: "#ffdcb5", borderRadius: 5, padding: 10 }}
                        />
                        <Button mode="contained" onPress={salvarQuantidadeCompradas}>Salvar</Button>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Gerenciador;

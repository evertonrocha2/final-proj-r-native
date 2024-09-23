import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import TopBar from "@/components/navigation/topbar";
import Fab from "@/components/fab";
import TextInput from "@/components/textInput";
import Grid from "@/components/grid";
import {
  initializeDatabase,
  inserirFraldas,
  buscarEstoque,
  atualizarEstoqueTotalUsuarioLocal,
} from "@/services/db";
import { auth } from "@/infra/firebase";
import { useFraldas } from "@/context/FraldasContext";
import { atualizarEstoqueTotalUsuario, obterOuCriarEstoqueUsuario } from "@/infra/fraldas";
import { useNetwork } from "@/context/NetworkContext";

const Gerenciador = () => {
  const { quantidadeFraldas, setQuantidadeFraldas } = useFraldas();
  const { isConnected } = useNetwork();
  const [db, setDb] = useState(null);
  const [inputQuantidade, setInputQuantidade] = useState("");
  const [alteracoesPendentes, setAlteracoesPendentes] = useState([]);

  const colors = useTheme();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const initialize = async () => {
      const dbInstance = await initializeDatabase();
      setDb(dbInstance);

      const { quantidadeFraldas } = await buscarEstoque(dbInstance);
      setQuantidadeFraldas(quantidadeFraldas);

      const estoqueFirebase = await obterOuCriarEstoqueUsuario(userId);
      if (estoqueFirebase.estoqueTotal !== quantidadeFraldas) {
        setQuantidadeFraldas(estoqueFirebase.estoqueTotal);
        await atualizarEstoqueTotalUsuarioLocal(dbInstance, userId, estoqueFirebase.estoqueTotal);
        await inserirFraldas(dbInstance, estoqueFirebase.estoqueTotal);
      }
    };
    initialize();
  }, [userId]);

  const sincronizarAlteracoesPendentes = async () => {
    if (alteracoesPendentes.length > 0) {
      const totalAlteracoes = alteracoesPendentes.reduce((acc, curr) => acc + curr, 0);
      await atualizarEstoqueTotalUsuario(userId, totalAlteracoes);
      const novoTotal = quantidadeFraldas + totalAlteracoes; 
      await inserirFraldas(db, novoTotal);
      setAlteracoesPendentes([]); 
    }
  };

  useEffect(() => {
    if (isConnected) {
      sincronizarAlteracoesPendentes();
    }
  }, [isConnected]);

  const salvarQuantidade = async () => {
    const novaQuantidade = parseInt(inputQuantidade, 10);
    if (isNaN(novaQuantidade) || !db) return;

    if (isConnected) {
      const novoTotal = quantidadeFraldas + novaQuantidade;
      await inserirFraldas(db, novoTotal);
      await atualizarEstoqueTotalUsuario(userId, novaQuantidade);
      setQuantidadeFraldas(novoTotal);
    } else {
      setAlteracoesPendentes((prev) => [...prev, novaQuantidade]);
      setQuantidadeFraldas((prev) => prev + novaQuantidade); 
    }

    setInputQuantidade("");
  };

  const fazerAlteracao = async (valor) => {
    if (isConnected) {
      const novoTotal = quantidadeFraldas + valor;
      await inserirFraldas(db, novoTotal);
      await atualizarEstoqueTotalUsuario(userId, valor);
      setQuantidadeFraldas(novoTotal);
    } else {
      setAlteracoesPendentes((prev) => [...prev, valor]);
      setQuantidadeFraldas((prev) => prev + valor); 
    }
  };

  return (
    <ScrollView>
      <View>
        <Grid style={{ backgroundColor: colors.colors.background, height: '100%' }}>
          <TopBar title="Gerenciador de Estoque" />
          <Grid>
            <Grid
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                backgroundColor: colors.colors.secondary,
                padding: 30,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: colors.colors.onPrimary, fontSize: 20, letterSpacing: -1, textAlign: "center" }}>
                Altere o estoque de Fraldas
              </Text>
              <Text style={{ color: colors.colors.onPrimary, fontSize: 30, letterSpacing: -1, textAlign: "center", fontWeight: 700 }}>
                Aumente ou reduza a quantidade atual de fraldas!
              </Text>
            </Grid>

            <View style={{ marginTop: 35 }}>
              <Text style={{ color: colors.colors.onBackground, fontSize: 28, fontWeight: 700, textAlign: "center" }}>
                Quantidade Total de Fraldas
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.colors.primary,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginTop: 20,
                gap: 20,
                width: 400,
                marginLeft: "auto",
                marginRight: "auto",
                padding: 30,
                borderRadius: 5,
              }}
            >
              <View>
                <Text style={{ color: colors.colors.onPrimary, fontSize: 20, fontWeight: 600 }}>
                  {quantidadeFraldas}
                </Text>
              </View>

              <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 2 }}>
                <Fab
                  style={{ backgroundColor: colors.colors.primary }}
                  icon="plus"
                  onPress={async () => {
                    await fazerAlteracao(1);
                  }}
                />
                <Fab
                  style={{ backgroundColor: colors.colors.primary }}
                  icon="minus"
                  onPress={async () => {
                    await fazerAlteracao(-1);
                  }}
                />
              </View>

              <View style={{ padding: 20 }}>
                <TextInput
                  value={inputQuantidade}
                  onChangeText={setInputQuantidade}
                  keyboardType="numeric"
                  textColor={colors.colors.onBackground}
                  style={{
                    marginBottom: 10,
                    backgroundColor: colors.colors.onPrimary,
                    borderRadius: 5,
                    padding: 10,
                  }}
                />
                <Button mode="contained" onPress={salvarQuantidade}>
                  Salvar
                </Button>
              </View>
            </View>
          </Grid>
        </Grid>
      </View>
    </ScrollView>
  );
};

export default Gerenciador;

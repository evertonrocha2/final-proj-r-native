
import { View, Text } from 'react-native';
import TopBar from '@/components/navigation/topbar';
import { router } from 'expo-router';
import { Button, useTheme } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { useFraldas } from '@/context/FraldasContext';

import { auth } from '@/infra/firebase';
import {
  initializeDatabase,
  inserirFraldas,
  reduzirFraldas,
  buscarEstoque
} from "@/services/db";
import { obterOuCriarEstoqueUsuario } from '@/infra/fraldas';
export default function HomeScreen() {
  const { quantidadeFraldas, setQuantidadeFraldas } = useFraldas();
  const [compradasMes, setCompradasMes] = useState(0);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const limiteFraldas = 10;

  const { isConnected } = useNetwork();

  const valorColocado = quantidadeFraldas > limiteFraldas ? "Cheio" : "Acabando"
  const colors = useTheme();
  const userId = auth.currentUser?.uid; 


  useEffect(() => {
    const initializeDatabase = async () => {
      const dbInstance = await SQLite.openDatabaseAsync('fraldasDB.db');
      setDb(dbInstance)
      await dbInstance.execAsync(`
        CREATE TABLE IF NOT EXISTS estoqueFraldas (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          quantidade INTEGER
        );
      `);

      await buscarEstoque(dbInstance);
    };

    initializeDatabase();
  }, []);

  useEffect(() => {
    const initialize = async () => {
        const dbInstance = await initializeDatabase();
        setDb(dbInstance);
        setQuantidadeFraldas(quantidadeFraldas);

        const estoqueFirebase = await obterOuCriarEstoqueUsuario(userId); 
        if (estoqueFirebase.estoqueTotal !== quantidadeFraldas) {
            setQuantidadeFraldas(estoqueFirebase.estoqueTotal);
            await inserirFraldas(dbInstance, estoqueFirebase.estoqueTotal);
        }
    };
    initialize();
}, [userId]);

  const buscarEstoque = async (db: SQLite.SQLiteDatabase) => {
    if (!db) return;

    const result = await db.getFirstAsync('SELECT * FROM estoqueFraldas ORDER BY id DESC LIMIT 1;');

    if (result) {
      //@ts-ignore
      setQuantidadeFraldas(result.quantidade);
    }
 
  };
  const { logout } = useAuth();
  return (
    <View>
      <TopBar title="Página Inicial" menu={true}/>
      <View style={{ display: 'flex', alignItems: 'center', padding: 0, flexDirection: 'row', justifyContent: 'center', marginTop: 50, gap: 20, }}>
        {
        (isConnected ? null : <Text style={{color: colors.colors.error}}>Você está sem conexão com a Internet!</Text>)}
        </View>
      <Button onPress={() => router.push("/")} mode="contained" textColor='white' style={{ backgroundColor: '#000', borderRadius: 0, marginTop: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, width: 400, marginLeft: 'auto', marginRight: 'auto' }}>Settings</Button>
      <View style={{ display: 'flex', alignItems: 'center', padding: 0, flexDirection: 'row', justifyContent: 'center', marginTop: 50, gap: 20, }}>
        <Text style={{ fontSize: 20, fontWeight: 600, color: colors.colors.primary}}>Martha Silva</Text>
      </View>
      <View>
        <Text style={{ fontSize: 22, fontWeight: 400, textAlign: 'center', marginTop: 20, color: colors.colors.primary }}>Bem vinda ao Sistema,</Text>
        <Text style={{ fontSize: 27, fontWeight: 600, textAlign: 'center', color: colors.colors.primary }}>Gerencie o estoque de Fraldas!</Text>
      </View >
      <View>
        <View style={{ backgroundColor: colors.colors.primary, width: '90%', height: 300, marginTop: 20, marginBottom: 20, marginLeft: 'auto', marginRight: 'auto', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: 600, textAlign: 'center' }}>
              {
                valorColocado
              }
            </Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginTop: 20, color: colors.colors.onPrimary}}>ESTOQUE ATUAL</Text>
          <Text style={{ fontSize: 32, fontWeight: 500,  textAlign: 'center', marginTop: 5, color: colors.colors.onPrimary }}>{quantidadeFraldas}</Text>
        </View >
        <Button onPress={() => router.push("/gerenciador")} mode="contained" textColor='white' style={{ backgroundColor: '#000', borderRadius: 0, marginTop: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 30, width: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          <Text style={{ fontSize: 20 }}>Clique aqui para gerenciar</Text>
        </Button>

      </View >
      <Button onPress={() => {
        logout();
      }
      }>Sair</Button>
    </View >
  );
}



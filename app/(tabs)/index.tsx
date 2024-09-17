
import { View, Text } from 'react-native';
import TopBar from '@/components/navigation/topbar';
import { router } from 'expo-router';
import { Button } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
export default function HomeScreen() {
  const [quantidadeFraldas, setQuantidadeFraldas] = useState(0);
  const [compradasMes, setCompradasMes] = useState(0);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const limiteFraldas = 10;

  const valorColocado = quantidadeFraldas > limiteFraldas ? "Cheio" : "Acabando"

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

  const buscarEstoque = async (db: SQLite.SQLiteDatabase) => {
    if (!db) return;

    const result = await db.getFirstAsync('SELECT * FROM estoqueFraldas ORDER BY id DESC LIMIT 1;');
    const result2 = await db.getFirstAsync('SELECT * FROM compradasMes ORDER BY id DESC LIMIT 1;');

    if (result) {
      //@ts-ignore
      setQuantidadeFraldas(result.quantidade);
    }
    if (result2) {
      //@ts-ignore
      setCompradasMes(result2.quantidade);
    }
  };
  const { logout } = useAuth();
  return (
    <View>
      <TopBar title="Página Inicial" />
      <View style={{ display: 'flex', alignItems: 'center', padding: 0, flexDirection: 'row', justifyContent: 'center', marginTop: 50, gap: 20, }}>
        <Text style={{ fontSize: 20, fontWeight: 600 }}>Martha Silva</Text>
      </View>
      <View>
        <Text style={{ fontSize: 22, fontWeight: 400, letterSpacing: -2, textAlign: 'center', marginTop: 20 }}>Bem vinda ao Sistema,</Text>
        <Text style={{ fontSize: 27, fontWeight: 600, letterSpacing: -2, textAlign: 'center' }}>Gerencie o estoque de Fraldas!</Text>
      </View >
      <View>
        <View style={{ backgroundColor: '#DDFFC2', width: '90%', height: 300, marginTop: 20, marginBottom: 20, marginLeft: 'auto', marginRight: 'auto', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 }}>
            <Text style={{ fontSize: 17, fontWeight: 600, letterSpacing: -2, textAlign: 'center' }}>
              {
                valorColocado
              }
            </Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: 700, letterSpacing: -2, textAlign: 'center', marginTop: 20 }}>ESTOQUE ATUAL</Text>
          <Text style={{ fontSize: 17, fontWeight: 500, letterSpacing: -1, textAlign: 'center', marginTop: 5 }}>{quantidadeFraldas}</Text>
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



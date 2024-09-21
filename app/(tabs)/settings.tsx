import TopBar from "@/components/navigation/topbar";
import { View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Button from "@/components/button";
import { Text } from "react-native-paper";
import { useTheme as useThemePaper } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme'
const SettingsScreen = () => {
  const colors = useThemePaper();
  const { toggleTheme } = useTheme();
  return (
    <View>
      <TopBar title="Settings" />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 30, textAlign: "center", marginVertical: 20 }}>Altere o tema!</Text>
        <Button icon="repeat" onPress={toggleTheme} mode="outlined" textColor={colors.colors.primary}>Mudar tema</Button>
      </View>
    </View>
  );
};

export default SettingsScreen;
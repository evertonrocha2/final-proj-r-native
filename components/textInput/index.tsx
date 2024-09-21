import { TextInput as TextInputPaper, useTheme } from "react-native-paper";
const TextInput = (props: any) => {
const colors = useTheme();

  return <TextInputPaper textColor={colors.colors.onPrimary} {...props} />;
};

export default TextInput;

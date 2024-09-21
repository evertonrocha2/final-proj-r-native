import { View } from "react-native";
import { RadioButton, RadioButtonProps } from "react-native-paper";

const Radio = (props: RadioButtonProps) => {
  return (
    <View>
      <RadioButton {...props} />
    </View>
  );
};

export default Radio;

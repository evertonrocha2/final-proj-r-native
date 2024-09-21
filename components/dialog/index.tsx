import { useState } from "react";
import { StyleSheet } from "react-native";
import {
  Portal,
  Dialog as DialogPaper,
  Text,
  Button,
} from "react-native-paper";

const Dialog = (props: any) => {
  return (
    <>
      <Portal>
        <DialogPaper visible={props.visible} onDismiss={props.hideDialog}>
          <DialogPaper.Icon icon={props.icon} />
          <DialogPaper.Title style={styles.title}>
            {props.title}
          </DialogPaper.Title>
          <DialogPaper.Content>
            <Text variant="bodyMedium">{props.text}</Text>
          </DialogPaper.Content>
          <DialogPaper.Actions>
            {props.actions.map((action: any, index: number) => {
              return (
                <Button key={index} onPress={action.onPress}>
                  {action.text}
                </Button>
              );
            })}
          </DialogPaper.Actions>
        </DialogPaper>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
});

Dialog.defaultProps = {
  actions: [],
  visible: false,
  hideDialog: () => {},
  text: "",
  title: "",
}

export default Dialog;

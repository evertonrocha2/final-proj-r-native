import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import Dialog from "../dialog";
import Modal from "../modal";
import Fab from "../fab";
//@ts-ignore
const Camera = forwardRef(({ setCameraVisible, onCapture }, ref) => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [dialogGrantCamera, setDialogGrantCamera] = useState(true);
  const [cameraRef, setCameraRef] = useState(null);

  const closeCamera = () => {
    setCameraVisible(false);
  };

  useImperativeHandle(ref, () => ({
    takePicture: async () => {
      console.log(cameraRef);
      if (cameraRef) {
        console.log(cameraRef);
        const photo = await cameraRef.takePictureAsync({
          base64: false,
          quality: 1,
          scale: 1,
        });

        console.log('Foto capturada:', photo); 
        onCapture(photo);
        closeCamera();
      }
    },
  }));

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      //@ts-ignore
      <Dialog
        icon={"alert"}
        title={"Permitir Acesso à Câmera?"}
        text={"Deseja permitir o acesso à câmera?"}
        visible={dialogGrantCamera}
        setVisibility={setDialogGrantCamera}
        onDismiss={() => setDialogGrantCamera(false)}
        actions={[
          {
            text: "Cancelar",
            onPress: () => {
              setDialogGrantCamera(false);
              setCameraVisible(false);
            },
          },
          {
            text: "Permitir",
            onPress: async () => {
              await requestPermission();
              setDialogGrantCamera(false);
              setCameraVisible(false);
            },
          },
        ]}
      />
    );
  }
  return (
    <Modal style={styles.container}>
      <CameraView
        //@ts-ignore
        ref={(ref) => setCameraRef(ref)}
        style={styles.camera}
        facing={facing}
      >
        <Fab
          onPress={closeCamera}
          icon="close"
          style={{ ...styles.closeButton }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Fab
              //@ts-ignore
              onPress={() => ref.current.takePicture()}
              icon="camera"
              style={{ ...styles.takePicture }}
            />
            <Fab
              icon="camera-flip"
              onPress={toggleCameraFacing}
              style={{ ...styles.takePicture }}
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  takePicture: {
    borderRadius: 200,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    borderRadius: 200,
    right: 10,
    zIndex: 10,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default Camera;

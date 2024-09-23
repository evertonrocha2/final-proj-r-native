import Fab from "@/components/fab";
import Grid from "@/components/grid";
import TopBar from "@/components/navigation/topbar";
import { useEffect, useRef, useState } from "react";
import { Avatar, Button, TextInput, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Camera from "@/components/camera";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "@/infra/firebase"; 
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const [message, setMessage] = useState();
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef();
  const [data, setData] = useState({});
  const [image, setImage] = useState(null);
  const [offlineChanges, setOfflineChanges] = useState(null);

  const getUser = async () => {
    const currentUser = auth.currentUser; 
    if (currentUser) {
      const userDoc = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDoc);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setData({
          displayName: userData.displayName || "",
          username: userData.username || "",
          email: currentUser.email,
          uid: currentUser.uid, 
          photoURL: userData.photoURL || currentUser.photoURL || "", 
        });
      } else {
        await setDoc(doc(db, "users", currentUser.uid), {
          displayName: currentUser.displayName || "",
          username: currentUser.username || "",
          email: currentUser.email,
          photoURL: currentUser.photoURL || "",
        });
        setData({
          displayName: currentUser.displayName || "",
          username: currentUser.username || "",
          email: currentUser.email,
          uid: currentUser.uid, 
          photoURL: currentUser.photoURL || "", 
        });
      }
    }
  };

  const _update = async () => {
    if (offlineChanges) {
      setOfflineChanges({
        displayName: data.displayName,
        username: data.username,
      });
      setMessage("Mudanças salvas localmente! Sincronize quando estiver online.");
    } else {
      await updateProfileData();
    }
  };

  const updateProfileData = async () => {
    const docRef = doc(db, "users", data.uid);
    await updateDoc(docRef, {
      displayName: data.displayName,
      username: data.username,
      email: data.email,
    });

    await auth.currentUser.updateProfile({
      displayName: data.displayName,
      photoURL: data.photoURL,
    });
    setMessage("Dados atualizados com sucesso!");
  };

  const uploadImage = async (imageUri) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const storage = getStorage();
      const imageRef = ref(storage, `users/${currentUser.uid}/profile.jpg`); 
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      await uploadBytes(imageRef, blob);
  
      const photoURL = await getDownloadURL(imageRef);
  
      await updateDoc(doc(db, "users", currentUser.uid), {
        photoURL: photoURL,
      });
  
      await currentUser.updateProfile({
        photoURL: photoURL,
      });
  
      setData((prevData) => ({
        ...prevData,
        photoURL: photoURL,
      }));
  
      setMessage("Foto de perfil atualizada com sucesso!");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],      
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await uploadImage(uri);
      AsyncStorage.setItem('photo', uri);
    }
  };

  const onCapture = async (photo) => {
    if (photo) {
      const { uri } = photo; 
      setImage(uri); 
      await uploadImage(uri);
      setData((v) => ({ ...v, photoURL: uri })); 
      AsyncStorage.setItem('photo', uri); 
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const syncOfflineChanges = async () => {
      if (offlineChanges) {
        await updateProfileData(); 
        setOfflineChanges(null); 
      }
    };

    syncOfflineChanges();
  }, [offlineChanges]);

  return (
    <>
      <Grid>
        <Grid>
          <TopBar title={"Perfil"} />
        </Grid>
        <Grid style={styles.containerImage}>
            {data?.photoURL ? (
              <Avatar.Image source={ image ? { uri: image } : { uri: data.photoURL }} size={180} style={{ borderRadius: 100 }} />
            ) : (
              <Avatar.Icon icon="account" size={230} />
            )}
            <Fab
              onPress={() => setCameraVisible(true)}
              icon="camera"
              style={{ ...styles.fab, ...styles.left }}
            />
            <Fab
              onPress={pickImage}
              icon="image"
              style={{ ...styles.fab, ...styles.right }}
            />
        </Grid>
        <Grid style={{ padding: 20 }}>
          <TextInput
            onChangeText={(text) =>
              setData((v) => ({ ...v, displayName: text }))
            }
            label="Nome"
            value={data.displayName}
          />
        </Grid>
        <Grid style={{ padding: 20 }}>
          <TextInput
            label="Usuário"
            value={data.username}
            onChangeText={(text) => setData((v) => ({ ...v, username: text }))}
          />
        </Grid>
        <Grid style={{ padding: 20 }}>
          <TextInput label="Email" value={data.email} disabled />
        </Grid>
        <Grid style={{ padding: 20 }}>
          <Button onPress={_update} style={{ marginTop: 20 }} mode="contained">
            Salvar
          </Button>
        </Grid>
      </Grid>
      {cameraVisible ? (
        <Camera
          onCapture={onCapture}
          setCameraVisible={setCameraVisible}
          ref={cameraRef}
        />
      ) : null} 
    </>
  );
};

const styles = {
  containerImage: {
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    marginTop: 50,
    margin: "auto",
    position: "relative",
    width: '50%'
  },
  fab: {
    position: "absolute",
    borderRadius: 200,
    bottom: 0,
  },
  right: {
    right: 0,
  },
  left: {
    left: 0,
  },
};

export default Profile;

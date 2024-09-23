import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { router } from "expo-router";
import AppBar from "../Appbar";
import Menu from "./menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "react-native-paper";

const TopBar = (props: any) => {
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();
    const { logout } = useAuth();
    const colors = useTheme();

    return (
        <>
            <AppBar
                onPress={() => {
                    if (props.back) {
                        navigation.goBack();
                    } else {
                        setVisible(!visible);
                    }
                }}
                back={props.back}
                title={props.title}
                icon={props.menu ? "dots-vertical" : ""}
            />
            {props.menu ? (
                <Menu
                    visible={visible}
                    setVisible={setVisible}
                    items={[
                        {
                            title: "Settings",
                            icon: "cog",
                            onPress: () => {
                                //@ts-ignore
                                router.push("/settings");
                            },
                        },
                        {
                            title: "Logout",
                            icon: "logout",
                            onPress: () => {
                                logout()
                            },
                        },
                    ]}
                />
            ) : null}
        </>
    );
};



export default TopBar;

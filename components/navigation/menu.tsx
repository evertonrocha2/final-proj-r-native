import { Surface, Text } from "react-native-paper";
import { Menu as Mn } from "react-native-paper";
const Menu = (props: any) => {
    return (
        <>
            {props.visible ? (
                <Surface
                    style={{
                        flex: 1,
                        position: "absolute",
                        top: 60,
                        right: 30,
                        backgroundColor: "white",
                        borderRadius: 5,
                        zIndex: 19999,
                    }}
                    elevation={4}
                >
                    {props.items.map((item: any, index: number) => {
                        return (
                            <Mn.Item
                                leadingIcon={item.icon}
                                key={index}
                                title={item.title}
                                onPress={() => {
                                    item.onPress();
                                    console.log("Fechar Menu");
                                    props.setVisible(false);
                                }}
                            />
                        );
                    })}
                </Surface>
            ) : null}
        </>
    );
};



export default Menu;

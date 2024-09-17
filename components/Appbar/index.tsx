import { Appbar, useTheme } from "react-native-paper";

const AppBar = (props: any) => {
    const colors = useTheme();
    return (
        <Appbar.Header style={{ backgroundColor: colors.colors.background }}>
            {props.back && <Appbar.BackAction {...props} />}
            <Appbar.Content {...props} />
            <Appbar.Action {...props} />
        </Appbar.Header>
    );
};

export default AppBar;

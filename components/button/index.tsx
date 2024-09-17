import { Button as Btn } from "react-native-paper";

const Button = (props: any) => {
    return (
        <>
            <Btn {...props}>{props.children}</Btn>
        </>
    );
};

export default Button;

import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';

import { colors, spacings } from '../../configs';

const InputBox = () => {
    const [newMessage, setNewMessage] = useState('');
    const onSend = () => {
        console.warn('Sending a new message: ', newMessage);

        setNewMessage('');
    };

    return (
        <View style={styles.viewContainer}>
            <AntDesign name={'plus'} size={spacings.icon} color={colors.blueIcon} />
            <TextInput
                style={styles.txtInput}
                placeholder={'type your message here...'}
                value={newMessage}
                onChangeText={setNewMessage}
            />
            <MaterialIcons
                onPress={onSend}
                name={'send'}
                size={spacings.iconSm}
                color={'white'}
                style={styles.iconSend}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
        padding: spacings.half,
        paddingHorizontal: spacings.def,
    },
    txtInput: {
        flex: 1,
        backgroundColor: 'white',
        padding: spacings.half,
        paddingHorizontal: spacings.def,
        marginHorizontal: spacings.def,

        borderRadius: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
    },
    iconSend: {
        backgroundColor: colors.blueIcon,
        padding: 6,
        borderRadius: 14,
        overflow: 'hidden',
    },
});

export default InputBox;

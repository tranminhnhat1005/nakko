import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacings } from '../../configs';

const InputBox = () => {
    const [newMessage, setNewMessage] = useState('');
    const onSend = () => {
        console.warn('Sending a new message: ', newMessage);

        setNewMessage('');
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.viewContainer}>
            <AntDesign name={'plus'} size={spacings.icon} color={colors.blueIcon} style={styles.icon} />
            <TextInput
                style={styles.txtInput}
                placeholder={'type your message here...'}
                value={newMessage}
                onChangeText={setNewMessage}
                // multiline
            />
            <MaterialIcons
                onPress={onSend}
                name={'send'}
                size={spacings.iconSm}
                color={'white'}
                style={styles.iconSend}
            />
        </SafeAreaView>
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
    icon: {
        width: spacings.icon,
        height: spacings.icon,
        alignSelf: 'center',
    },
    iconSend: {
        backgroundColor: colors.blueIcon,
        padding: 6,
        borderRadius: 14,
        overflow: 'hidden',
        alignSelf: 'center',
    },
});

export default InputBox;

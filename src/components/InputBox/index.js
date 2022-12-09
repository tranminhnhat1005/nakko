import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, Platform, View, SafeAreaView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { API, graphqlOperation, Auth } from 'aws-amplify';

import { createMessage, updateChatRoom } from '../../graphql/mutations';
import { colors, spacings } from '../../configs';

const IS_IOS = Platform.OS === 'ios';
const InputBox = ({ chatRoom }) => {
    const [text, setText] = useState('');
    const onSend = async () => {
        const {
            attributes: { sub: userID },
        } = await Auth.currentAuthenticatedUser();
        const input = {
            chatroomID: chatRoom.id,
            text,
            userID,
        };

        const newMessageData = await API.graphql(graphqlOperation(createMessage, { input }));

        setText('');

        await API.graphql(
            graphqlOperation(updateChatRoom, {
                input: {
                    _version: chatRoom._version,
                    chatRoomLastMessageId: newMessageData.data.createMessage.id,
                    id: chatRoom.id,
                },
            })
        );
    };

    return (
        <View style={styles.viewContainer}>
            <AntDesign name={'plus'} size={spacings.icon} color={colors.blueIcon} style={styles.icon} />
            <TextInput
                style={styles.txtInput}
                placeholder={'type your message here...'}
                value={text}
                onChangeText={setText}
                // multiline
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
        paddingVertical: spacings.half,
        paddingHorizontal: spacings.def,
        alignItems: 'flex-end',
    },
    txtInput: {
        flex: 1,
        minHeight: 40,
        backgroundColor: 'white',
        paddingVertical: spacings.half,
        paddingHorizontal: spacings.def,
        marginHorizontal: spacings.def,

        borderRadius: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
    },
    icon: {
        width: spacings.icon,
        height: spacings.icon,
        marginBottom: 8,
    },
    iconSend: {
        backgroundColor: colors.blueIcon,
        padding: spacings.half,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
});

export default InputBox;

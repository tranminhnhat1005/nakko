import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API, graphqlOperation, Auth } from 'aws-amplify';

import { createMessage, updateChatRoom } from '../../graphql/mutations';
import { colors, spacings } from '../../configs';

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
        <SafeAreaView edges={['bottom']} mode={'margin'} style={styles.viewContainer}>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
        paddingVertical: spacings.half,
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

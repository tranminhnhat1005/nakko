import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { colors, spacings } from '../../configs';

const Message = ({ message }) => {
    const isMyMessage = () => {
        return message.user.id === 'u1';
    };

    const viewContainerStyle = () => {
        const customStyle = {
            alignSelf: isMyMessage() ? 'flex-end' : 'flex-start',
            backgroundColor: isMyMessage() ? colors.greenMsg : 'white',
        };
        return [styles.viewContainer, customStyle];
    };

    return (
        <View style={viewContainerStyle()}>
            <Text style={styles.txtMessage}>{message.text}</Text>
            <Text style={styles.txtTime}>{moment(message.createdAt).fromNow(true)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        // alignSelf: 'flex-end',
        // backgroundColor: 'white',

        margin: spacings.half,
        padding: spacings.def,
        borderRadius: spacings.def,
        maxWidth: '80%',

        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,

        elevation: 1,
    },
    txtMessage: {},
    txtTime: {
        color: 'grey',
        alignSelf: 'flex-end',
    },
});

export default Message;

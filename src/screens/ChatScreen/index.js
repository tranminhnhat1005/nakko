import { FlatList, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import data from '../../../assets/data/messages.json';
import bg from '../../../assets/images/BG.png';
import InputBox from '../../components/InputBox';
import Message from '../../components/Message';
import { spacings } from '../../configs';

const IS_IOS = Platform.OS === 'ios';

const ChatScreen = () => {
    const renderItem = ({ item }) => {
        return <Message message={item} />;
    };
    return (
        <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : 'height'} style={styles.bg}>
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList inverted style={styles.flatList} data={data} renderItem={renderItem} />
                <InputBox />
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    flatList: {
        padding: spacings.def,
    },
});

export default ChatScreen;

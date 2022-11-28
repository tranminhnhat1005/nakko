import { FlatList, ImageBackground, StyleSheet } from 'react-native';

import data from '../../../assets/data/messages.json';
import bg from '../../../assets/images/BG.png';
import Message from '../../components/Message';
import { spacings } from '../../configs';

const ChatScreen = () => {
    const renderItem = ({ item }) => {
        return <Message message={item} />;
    };
    return (
        <ImageBackground source={bg} style={styles.bg}>
            <FlatList inverted style={styles.flatList} data={data} renderItem={renderItem} />
        </ImageBackground>
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

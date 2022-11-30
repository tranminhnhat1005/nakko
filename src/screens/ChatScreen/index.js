import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { FlatList, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import data from '../../../assets/data/messages.json';
import bg from '../../../assets/images/BG.png';
import InputBox from '../../components/InputBox';
import Message from '../../components/Message';
import { spacings } from '../../configs';

const IS_IOS = Platform.OS === 'ios';

const ChatScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const insetTop = useSafeAreaInsets()['top'];
    // insetTop = 47 is notch-iPhone, smaller than is home button-iPhone
    // spacings.half * 2 is the padding of InputBox
    const iosVerticalOffset = insetTop < 47 ? 65 : Math.ceil(insetTop) + spacings.half * 2;
    const androidVerticalOffset = Math.ceil(insetTop) + spacings.half * 2 + 130;

    useEffect(() => {
        navigation.setOptions({ title: route.params.name });
    }, [route.params.name]);

    navigation.setOptions;

    const renderItem = ({ item }) => {
        return <Message message={item} />;
    };
    return (
        <KeyboardAvoidingView
            behavior={IS_IOS ? 'padding' : 'height'}
            keyboardVerticalOffset={IS_IOS ? iosVerticalOffset : androidVerticalOffset}
            style={styles.bg}
        >
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

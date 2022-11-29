import { FlatList, StyleSheet } from 'react-native';

import data from '../../../assets/data/chats.json';
import ContactListItem from '../../components/ContactListItem';

const ContactScreen = () => {
    const renderItem = ({ item }) => {
        return <ContactListItem user={item.user} />;
    };
    return <FlatList style={styles.flatList} data={data} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
    flatList: {
        backgroundColor: 'white',
    },
});

export default ContactScreen;

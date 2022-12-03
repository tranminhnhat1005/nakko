import { FlatList, StyleSheet } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';

import { listUsers } from '../../graphql/queries';
import ContactListItem from '../../components/ContactListItem';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactScreen = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchListContacts = async () => {
            const response = await API.graphql(graphqlOperation(listUsers));
            const authUserId = await AsyncStorage.getItem('AUTH_USER_ID');
            if (response.data.listUsers.items) {
                const clone = [...response.data.listUsers.items];
                const length = clone.length;
                for (let i = 0; i < length; i++) {
                    const userId = clone[i] && clone[i].id;
                    if (userId === authUserId) {
                        clone.splice(i, 1);
                    }
                }
                setUsers(clone);
            }
        };
        fetchListContacts();
    }, []);

    const renderItem = ({ item }) => {
        return <ContactListItem user={item} />;
    };
    return <FlatList style={styles.flatList} data={users} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
    flatList: {
        backgroundColor: 'white',
    },
});

export default ContactScreen;

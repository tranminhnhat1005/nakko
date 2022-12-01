import { FlatList, StyleSheet } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';

import { listUsers } from '../../graphql/queries';
import ContactListItem from '../../components/ContactListItem';
import { useEffect, useState } from 'react';

const ContactScreen = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((response) => {
            setUsers(response.data?.listUsers?.items);
        });
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

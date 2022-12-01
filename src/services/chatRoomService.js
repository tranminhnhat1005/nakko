import { API, graphqlOperation, Auth } from 'aws-amplify';

export const getCommonChatRoomWithAuthUser = async (userId) => {
    // get all chat rooms of user 1
    const {
        attributes: { sub },
    } = await Auth.currentAuthenticatedUser();

    const { data } = await API.graphql(
        graphqlOperation(listChatRooms, {
            id: sub,
        })
    );

    const chatRooms = data?.getUser?.ChatRooms?.items || [];
    const chatRoom = chatRooms.find((chatRoomItem) => {
        return chatRoomItem.chatRoom.users.items.some((userItem) => userItem.user.id === userId);
    });

    return chatRoom;
    // get all chat rooms of user 2
    // remove the group chat
    // get common chat room
};
export const listChatRooms = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            ChatRooms {
                items {
                    chatRoom {
                        id
                        users {
                            items {
                                user {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

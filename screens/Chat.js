import { GiftedChat } from 'react-native-gifted-chat'
import { useCallback, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { signOut } from 'firebase/auth'
import { auth, database } from '../config/firebase'
import {
	collection,
	addDoc,
	orderBy,
	query,
	onSnapshot
} from 'firebase/firestore'

import colors from '../colors'

export const Chat = () => {
	const [messages, setMessages] = useState([])
	const navigation = useNavigation()

	const onSignOut = () => {
		signOut(auth).catch(error => console.log('Error logging out: ', error))
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					style={{
						marginRight: 10
					}}
					onPress={onSignOut}
				>
					<AntDesign name="logout" size={24} color={colors.gray} style={{ marginRight: 10 }}/>
				</TouchableOpacity>
			)
		})
	}, [navigation])

	useLayoutEffect(() => {

		const collectionRef = collection(database, 'chats')
		const q = query(collectionRef, orderBy('createdAt', 'desc'))

		const unsubscribe = onSnapshot(q, querySnapshot => {
			console.log('querySnapshot unsusbscribe')
			setMessages(
				querySnapshot.docs.map(doc => ({
					_id: doc.data()._id,
					createdAt: doc.data().createdAt.toDate(),
					text: doc.data().text,
					user: doc.data().user
				}))
			)
		})
		return () => unsubscribe()
	}, [])

	const onSend = useCallback((messages = []) => {
		setMessages(previousMessages =>
			GiftedChat.append(previousMessages, messages)
		)
		// setMessages([...messages, ...messages]);
		const { _id, createdAt, text, user } = messages[0]
		addDoc(collection(database, 'chats'), {
			_id,
			createdAt,
			text,
			user
		})
	}, [])

	return (
		<GiftedChat
			messages={messages}
			showAvatarForEveryMessage={false}
			showUserAvatar={false}
			onSend={messages => onSend(messages)}
			messagesContainerStyle={{
				backgroundColor: '#fff'
			}}
			textInputStyle={{
				backgroundColor: '#fff',
				borderRadius: 20,
			}}
			user={{
				_id: auth?.currentUser?.email,
				name: 'React Native',
				avatar: 'https://i.pravatar.cc/300'
			}}
		/>
	)
}
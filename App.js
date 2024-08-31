import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Chat } from './screens/Chat'
import { NavigationContainer } from '@react-navigation/native'
import { LogIn } from './screens/LogIn'
import { SignUp } from './screens/SignUp'
import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import { Home } from './screens/Home'
import { auth } from './config/firebase'
import { ActivityIndicator, View } from 'react-native'

const Stack = createNativeStackNavigator()

const AuthenticatedUserContext = createContext({})
const AuthenticatedUserProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	return (
		<AuthenticatedUserContext.Provider value={{ user, setUser }}>
			{children}
		</AuthenticatedUserContext.Provider>
	)
}

const ChatStack = () => {
	return (
		<Stack.Navigator
			defaultScreenOptions={Home}
			screenOptions={{
				headerShown: true,
				headerTitleAlign: 'center',
			}}
		>
			<Stack.Screen name="Home" component={Home}/>
			<Stack.Screen name="Chat" component={Chat}/>
		</Stack.Navigator>
	)
}

const AuthStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="LogIn" component={LogIn}/>
			<Stack.Screen name="SignUp" component={SignUp}/>
		</Stack.Navigator>
	)
}

const RootNavigator = () => {
	const { user, setUser } = useContext(AuthenticatedUserContext)
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		// onAuthStateChanged returns an unsubscriber
		const unsubscribeAuth = onAuthStateChanged(
			auth,
			async authenticatedUser => {
				authenticatedUser ? setUser(authenticatedUser) : setUser(null)
				setIsLoading(false)
			}
		)
		// unsubscribe auth listener on unmount
		return () => unsubscribeAuth()
	}, [user])
	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large"/>
			</View>
		)
	}

	return (
		<NavigationContainer>
			{user ? <ChatStack/> : <AuthStack/>}
		</NavigationContainer>
	)
}

export default function App() {
	return (
		<AuthenticatedUserProvider>
			<RootNavigator/>
		</AuthenticatedUserProvider>
	)
}


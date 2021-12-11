import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { Ionicons } from '@expo/vector-icons'

import Home from './Screens/Home'

import Game from './Screens/Game'
import HighScoreList from './Screens/HighScoreList'

export type RootStackParamList = {
	Home: undefined
	Game: { difficulty: 'easy' | 'hard' }
	'High Score List': undefined
}

export type RouteNavigationProps<T extends keyof RootStackParamList> =
	StackScreenProps<RootStackParamList, T>

export default function App() {
	// const Tab = createBottomTabNavigator()
	const Stack = createStackNavigator<RootStackParamList>()

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name='Home' component={Home} />
				<Stack.Screen name='Game' component={Game} />
				<Stack.Screen name='High Score List' component={HighScoreList} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

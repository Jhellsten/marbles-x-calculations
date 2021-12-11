import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScreenWidth } from 'react-native-elements/dist/helpers'
import { RouteNavigationProps } from '../App'
import CustomButton from '../components/CustomButton'

export default function Home({ navigation }: RouteNavigationProps<'Home'>) {
	return (
		<View style={styles.container}>
			<LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}>
				<View style={styles.buttonContainer}>
					<Text style={styles.title}>{'Marbles'}</Text>
					<Text style={styles.title}>{'X'}</Text>
					<Text style={[styles.title, styles.lastTitle]}>{'Calculations'}</Text>
					<View style={styles.button}>
						<CustomButton
							text={'Easy Game'}
							handlePress={() =>
								navigation.navigate('Marbles game', { difficulty: 'easy' })
							}
						/>
					</View>
					<View style={styles.button}>
						<CustomButton
							text={'Hard Game'}
							handlePress={() =>
								navigation.navigate('Marbles game', { difficulty: 'hard' })
							}
						/>
					</View>
					<View style={styles.button}>
						<CustomButton
							text={'Highscores'}
							handlePress={() => navigation.navigate('High Score List')}
						/>
					</View>
				</View>
				<StatusBar style='auto' />
			</LinearGradient>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	header: {
		fontSize: 20,
		marginBottom: '5%',
	},
	buttonContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: ScreenWidth,
	},
	button: {
		marginVertical: 10,
		color: 'black',
		backgroundColor: 'blue',
		minWidth: '60%',
		borderRadius: 4,
	},
	appContainer: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: '#fff',
		fontSize: 30,
	},
	lastTitle: {
		marginBottom: '20%',
	},
})

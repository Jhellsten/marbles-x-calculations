import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RouteNavigationProps } from '../App'
import CustomButton from '../components/CustomButton'

export default function Home({ navigation }: RouteNavigationProps<'Home'>) {
	return (
		<View style={styles.container}>
			<LinearGradient // Button Linear Gradient
				colors={['#4c669f', '#3b5998', '#192f6a']}
			>
				<View style={styles.buttonContainer}>
					<View style={styles.button}>
						<CustomButton
							text={'Easy Game'}
							handlePress={() =>
								navigation.navigate('Game', { difficulty: 'easy' })
							}
						/>
					</View>
					<View style={styles.button}>
						<CustomButton
							text={'Hard Game'}
							handlePress={() =>
								navigation.navigate('Game', { difficulty: 'hard' })
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
		alignItems: 'center',
		justifyContent: 'space-around',
		marginBottom: '5%',
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
})

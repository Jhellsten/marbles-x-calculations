import React, { useEffect, useRef, useState } from 'react'
import { SectionList, StyleSheet, Text, TextInput, View } from 'react-native'
import { initializeApp } from 'firebase/app'
import {
	addDoc,
	collection,
	doc,
	getDocs,
	getFirestore,
	onSnapshot,
	deleteDoc,
	query,
	where,
} from 'firebase/firestore'
import {
	apiKey,
	appId,
	authDomain,
	measurementId,
	messagingSenderId,
	projectId,
	storageBucket,
} from '../env'
import CustomButton from '../components/CustomButton'
import { Input, ListItem, Switch } from 'react-native-elements'
import { ScreenWidth } from 'react-native-elements/dist/helpers'
import { LinearGradient } from 'expo-linear-gradient'
import { Divider } from 'react-native-elements/dist/divider/Divider'

export default function HighScoreList() {
	// InitializeFirebasewithyourown config parameters
	const firebaseConfig = {
		apiKey,
		authDomain,
		projectId,
		storageBucket,
		measurementId,
		messagingSenderId,
		appId,
	}

	type HighScoreItem = {
		id?: string
		nickname: string
		difficulty: 'easy' | 'hard'
		score: number
	}

	const app = initializeApp(firebaseConfig)
	const database = getFirestore(app)
	const [difficulty, setListDifficulty] = useState<string>('easy')
	const [easyList, setEasyList] = useState<HighScoreItem[]>([])
	const [hardList, setHardList] = useState<HighScoreItem[]>([])

	const getFirebaseData = async () => {
		const querySnapshot = await getDocs(
			collection(database, 'marbles-highscores')
		)
		const easy: HighScoreItem[] = []
		const hard: HighScoreItem[] = []
		querySnapshot.forEach((doc) => {
			const { nickname, score, difficulty } = doc.data()
			if (difficulty === 'easy') {
				easy.push({ id: doc.id, nickname, score, difficulty })
			} else {
				hard.push({ id: doc.id, nickname, score, difficulty })
			}
		})
		easy.sort((a, b) => b.score - a.score)
		hard.sort((a, b) => b.score - a.score)
		setEasyList(easy)
		setHardList(hard)
	}

	useEffect(() => {
		const getData = () => {
			try {
				getFirebaseData()
			} catch (error) {
				alert(error)
			}
		}
		getData()
	}, [])

	return (
		<View style={styles.container}>
			<LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}>
				<Text style={styles.highScoreItem}>{'High score list'}</Text>
				<SectionList
					sections={[
						{ title: 'Easy', data: easyList },
						{ title: 'Hard', data: hardList },
					]}
					contentContainerStyle={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						width: ScreenWidth,
					}}
					renderSectionHeader={({ section: { title } }) => (
						<ListItem
							style={{ width: ScreenWidth * 0.95, marginTop: 20 }}
							bottomDivider
						>
							<ListItem.Content>
								<ListItem.Title>{title}</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					)}
					renderSectionFooter={({ section: { title } }) => <Divider />}
					renderItem={({ item }: any) => {
						return (
							<ListItem
								style={{ width: ScreenWidth * 0.95 }}
								key={item.id}
								bottomDivider
							>
								<ListItem.Content>
									<ListItem.Subtitle>{'Nickname'}</ListItem.Subtitle>
								</ListItem.Content>
								<ListItem.Content>
									<ListItem.Title>{item.nickname}</ListItem.Title>
								</ListItem.Content>
								<ListItem.Content>
									<ListItem.Subtitle>{'Score'}</ListItem.Subtitle>
								</ListItem.Content>
								<ListItem.Content>
									<ListItem.Title>{item.score}</ListItem.Title>
								</ListItem.Content>
							</ListItem>
						)
					}}
				/>
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
	button: {
		width: '50%',
		marginVertical: 10,
	},
	highScoreItem: {
		color: 'white',
		marginVertical: 40,
		fontSize: 30,
		textAlign: 'center',
	},
	itemStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '70%',
	},
	itemTextStyle: {
		marginLeft: 'auto',
		color: 'green',
		fontSize: 12,
	},
})

import React, { useEffect, useRef, useState } from 'react'
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
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
import { Input, ListItem } from 'react-native-elements'
import { ScreenWidth } from 'react-native-elements/dist/helpers'

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
	const database = getFirestore()
	const [listText, setListText] = useState<string>('')
	const [listAmount, setListAmount] = useState<string>('')
	const [list, setList] = useState<HighScoreItem[]>([])

	const getFirebaseData = async () => {
		const querySnapshot = await getDocs(collection(database, 'shoppinglist'))
		const items: HighScoreItem[] = []
		querySnapshot.forEach((doc) => {
			const { nickname, score, difficulty } = doc.data()
			items.push({ id: doc.id, nickname, score, difficulty })
		})
		setList(items)
	}

	useEffect(() => {
		try {
			const q = query(collection(database, 'highScoreList'))
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const items: HighScoreItem[] = []
				querySnapshot.forEach((doc) => {
					items.push({
						id: doc.id,
						score: doc.data().score,
						difficulty: doc.data().difficulty,
						nickname: doc.data().nickname,
					})
				})
				setList(items)
			})
			;() => {
				unsubscribe()
			}
		} catch (error) {
			alert(error)
		}
	}, [])

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

	const saveItem = async ({ nickname, score, difficulty }: any) => {
		try {
			await addDoc(collection(database, 'highScoreList'), {
				nickname,
				score,
				difficulty,
			})
		} catch (error) {
			alert(error)
		}
	}

	const deleteItem = async (id: string) => {
		try {
			await deleteDoc(doc(database, 'highScoreList', id))
		} catch (error) {
			alert(error)
		}
	}

	const handleSaveItem = (item: any) => {
		try {
			saveItem(item)
			setListAmount('')
			setListText('')
		} catch (error) {
			alert(error)
		}
	}

	return (
		<View style={styles.container}>
			<Text>High score list!</Text>
			<Text style={styles.highScoreItem}>{'High score list'}</Text>
			<FlatList
				data={list}
				contentContainerStyle={{
					flex: 1,
					justifyContent: 'flex-start',
					alignItems: 'center',
				}}
				renderItem={({ item }: any) => {
					return (
						<ListItem
							style={{ width: ScreenWidth * 0.95 }}
							key={item.id}
							bottomDivider
						>
							<ListItem.Content>
								<ListItem.Title>{item.product}</ListItem.Title>
								<ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
							</ListItem.Content>
							<ListItem.Chevron
								name='trash'
								tvParallaxProperties={undefined}
								color={'red'}
								size={20}
								style={{ marginLeft: 'auto' }}
								onPress={() => deleteItem(item.id)}
							/>
						</ListItem>
					)
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 20,
	},
	inputContainer: {
		marginTop: 20,
		flexDirection: 'column',
		alignContent: 'center',
		justifyContent: 'space-around',
		width: '60%',
		fontSize: 20,
	},
	input: {
		width: 200,
		color: 'black',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
		borderColor: 'black',
		borderWidth: 2,
		padding: 10,
	},
	amountInput: {
		width: 75,
	},
	button: {
		width: '50%',
		marginVertical: 10,
	},
	highScoreItem: {
		color: 'blue',
		marginVertical: 10,
		fontSize: 20,
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

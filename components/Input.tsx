import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
	StyleProp,
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	View,
} from 'react-native'

type Props = {
	value: string
	handleChange: (e: any) => void
	type?: TextInputProps['keyboardType']
}

export default function CustomInput({ value, handleChange, type }: Props) {
	return (
		<View style={inputStyles.inputContainer}>
			<TextInput
				style={inputStyles.input}
				value={value}
				onChangeText={(text) => handleChange(text)}
				keyboardType={type}
			/>
		</View>
	)
}

const inputStyles = StyleSheet.create({
	inputContainer: {
		flexDirection: 'row',
		alignContent: 'center',
		width: '100%',
		fontSize: 20,
	},
	input: {
		width: '50%',
		color: 'black',
		margin: 10,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
		borderColor: 'gray',
		borderWidth: 2,
		padding: 10,
	},
})

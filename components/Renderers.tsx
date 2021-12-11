import React, { PureComponent, useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Animated, { Easing, EasingNode } from 'react-native-reanimated'

const Box = ({ body, size, xAdjustment, yAdjustment, color }: any) => {
	const width = size[0]
	const height = size[1]
	const xAdjust = xAdjustment ? xAdjustment : 0
	const yAdjust = yAdjustment ? yAdjustment : 0

	const x = body.position.x - width / 2 + xAdjust
	const y = body.position.y - height / 2 - yAdjust

	return (
		<View
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: width,
				height: height,
				backgroundColor: color,
			}}
		/>
	)
}

const RADIUS = 20

type FingerProps = {
	position: [number, number]
}

const Circle = ({ body, size, xAdjustment, yAdjustment, color }: any) => {
	const width = size[0]
	const height = size[1]
	const xAdjust = xAdjustment ? xAdjustment : 0
	const yAdjust = yAdjustment ? yAdjustment : 0

	const x = body.position.x - width / 2 + xAdjust
	const y = body.position.y - height / 2 - yAdjust

	return (
		<View
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: width,
				height: height,
				backgroundColor: color,
				borderRadius: 25,
				borderColor: 'pink',
				borderWidth: 1,
			}}
		></View>
	)
}

class Finger extends PureComponent<FingerProps> {
	render() {
		const x = this.props.position[0] - RADIUS / 2
		const y = this.props.position[1] - RADIUS / 2
		return <View style={[styles.finger, { left: x, top: y }]} />
	}
}

export default function NumberItem({
	number,
	position,
}: {
	number: number
	position: [number, number]
}) {
	const x = position[0] - RADIUS / 2
	const y = position[1] - RADIUS / 2
	return (
		<View style={[styles.finger, { left: x, top: y }]}>
			<Text>{`${number}`}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	finger: {
		borderColor: '#CCC',
		borderWidth: 4,
		borderRadius: RADIUS * 2,
		width: RADIUS * 2,
		height: RADIUS * 2,
		backgroundColor: 'pink',
		position: 'absolute',
	},
})

export { Box, Finger, Circle }

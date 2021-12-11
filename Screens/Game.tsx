import React, { PureComponent } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { GameEngine } from 'react-native-game-engine'
import { Box, Circle, Finger } from '../components/Renderers'
import { LinearGradient } from 'expo-linear-gradient'

import {
	ball,
	BALL_SIZE,
	PLANK_WIDTH,
	PLANK_HEIGHT,
	topWall,
	GAME_WIDTH,
	bottomWall,
	leftWall,
	GAME_HEIGHT,
	rightWall,
	BALL_START_POINT_X,
	BALL_START_POINT_Y,
	snowFlake,
	blackHole,
} from '../components/GameSettingsConstants'
import Matter from 'matter-js'
import {
	DeviceMotion,
	DeviceMotionMeasurement,
	ThreeAxisMeasurement,
} from 'expo-sensors'
import { Subscription } from 'expo-modules-core'
import { RootStackParamList } from '../App'

const engine = Matter.Engine.create({ enableSleeping: false, gravity: {} })

const world = engine.world

Matter.World.add(world, [
	ball,
	topWall,
	bottomWall,
	leftWall,
	rightWall,
	snowFlake,
	blackHole,
])

type State = {
	subscription: Subscription | null
	score: number
	health: number
	isGameOver: boolean
}

export default class BestGameEver extends PureComponent<
	RootStackParamList['Game'],
	State
> {
	physics: (entities: any, { time }: { time: any }) => any
	constructor(props: any) {
		super(props)
		this.physics = (entities, { time }) => {
			let engine: Matter.Engine = entities['physics'].engine
			engine.gravity.y = 0

			Matter.Engine.update(engine, time.delta)

			return entities
		}
		this.state = {
			score: 0,
			subscription: null,
			health: 10,
			isGameOver: false,
		}
	}

	_slow = () => {
		DeviceMotion.setUpdateInterval(40)
	}

	// _fast = () => {
	// 	Gyroscope.setUpdateInterval(10)
	// }

	_subscribe = () => {
		this._slow()
		this.setState({
			subscription: DeviceMotion.addListener(
				(deviceMotion: DeviceMotionMeasurement) => {
					const motionPercent = 0.001
					// Alpha is Z axis and beta is X axis and gamma Y axis
					const { alpha, beta, gamma } = deviceMotion.rotation

					Matter.Body.applyForce(
						ball,
						{
							x: ball.position.x,
							y: ball.position.y,
						},
						{ x: gamma / 1000, y: beta / 1000 }
					)
					Matter.Body.applyForce(
						snowFlake,
						{
							x: snowFlake.position.x,
							y: snowFlake.position.y,
						},
						{ x: gamma / 500, y: beta / 500 }
					)
				}
			),
		})
	}

	componentDidMount() {
		this._subscribe()
		this._slow()
		Matter.Body.setPosition(ball, {
			x: BALL_START_POINT_X,
			y: BALL_START_POINT_Y,
		})
		Matter.Body.setPosition(snowFlake, {
			x: BALL_START_POINT_X,
			y: BALL_START_POINT_Y,
		})
		Matter.Body.setVelocity(ball, {
			x: 0,
			y: 0,
		})

		// [1,2,3,4,5,6,7,8].forEach(element => {
		// 	Matter.Composite.add(b)
		// });

		Matter.Events.on(engine, 'collisionStart', (event: any) => {
			const pairs = event.pairs

			const getObj = (label: string) => {
				switch (label) {
					case 'ball':
						return ball
					case 'snowFlake':
						return snowFlake
					default:
						return null
				}
			}
			// Ball since only thing that can collide
			const objA = pairs[0].bodyA
			const collisionObject = getObj(objA.label)
			// What ball collides to
			const objB = pairs[0].bodyB
			const defaultBounceForce = 0.8
			console.log(objB.label, objA.label)
			if (collisionObject) {
				console.log(objB.label, collisionObject.label)
				if (objB.label === 'bottomWall') {
					Matter.Body.setVelocity(collisionObject, {
						x: collisionObject.velocity.x,
						y: collisionObject.velocity.y * -defaultBounceForce,
					})
				}
				//Horizontal wall collision
				else if (objB.label === 'topWall') {
					Matter.Body.setVelocity(collisionObject, {
						x: collisionObject.velocity.x,
						y: collisionObject.velocity.y * -defaultBounceForce,
					})
				} else if (objB.label === 'rightWall') {
					Matter.Body.setVelocity(collisionObject, {
						x: collisionObject.velocity.x * -defaultBounceForce,
						y: collisionObject.velocity.y,
					})
				} else if (objB.label === 'leftWall') {
					Matter.Body.setVelocity(collisionObject, {
						x: Math.abs(collisionObject.velocity.x * -defaultBounceForce),
						y: collisionObject.velocity.y,
					})
				}
				if (objB.label.includes('Wall')) {
					this.setState({
						health: this.state.health - 1,
					})
				}
				if (
					this.state.health === 0 ||
					(collisionObject.label === 'ball' && objB.label === 'blackHole') ||
					(objA.label === 'blackHole' && objB.label === 'ball')
				) {
					this.setState({
						isGameOver: true,
					})
				}
			}
			// world.bodies.push(ball)
		})
	}

	componentWillUnmount() {
		this._unsubscribe()
	}
	_unsubscribe = () => {
		this.state.subscription && this.state.subscription.remove()
		this.setState({
			subscription: null,
		})
	}

	static navigationOptions = {
		header: null, // we don't need a header
	}

	render() {
		return (
			<GameEngine
				style={styles.container}
				systems={[this.physics]}
				entities={{
					physics: {
						engine: engine,
						world: world,
					},
					ball: {
						body: ball,
						size: [BALL_SIZE, BALL_SIZE],
						renderer: Circle,
						color: 'blue',
						mass: 1.0,
					},
					blackHole: {
						body: blackHole,
						size: [BALL_SIZE, BALL_SIZE],
						renderer: Circle,
						color: 'black',
						mass: 1.0,
					},
					theCeiling: {
						body: topWall,
						size: [GAME_WIDTH, 10],
						color: 'black',
						renderer: Box,
						yAdjustment: -30,
					},
					theFloor: {
						body: bottomWall,
						size: [GAME_WIDTH, 10],
						color: 'black',
						renderer: Box,
						yAdjustment: 25,
					},
					theLeftWall: {
						body: leftWall,
						size: [10, GAME_HEIGHT],
						color: 'black',
						renderer: Box,
						xAdjustment: 25,
					},
					theRightWall: {
						body: rightWall,
						size: [10, GAME_HEIGHT],
						color: 'black',
						renderer: Box,
						xAdjustment: -25,
					},
					snowFlake: {
						body: snowFlake,
						size: [4, 4],
						color: 'white',
						renderer: Circle,
					},
				}}
			>
				<StatusBar hidden={true} />
				<LinearGradient // Button Linear Gradient
					colors={['#4c669f', '#3b5998', '#192f6a']}
				>
					<View style={styles.scoresContainer}>
						<Text style={styles.scoreText}>{'Score'}</Text>
						<Text style={styles.scoreText}> {this.state.score} </Text>
						<Text style={styles.scoreText}>{'Health'}</Text>
						<Text style={styles.scoreText}>{this.state.health}</Text>
						<Text style={styles.scoreText}>
							{this.state.isGameOver ? 'Game over!' : ''}
						</Text>
					</View>
				</LinearGradient>
			</GameEngine>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: GAME_WIDTH,
		height: GAME_HEIGHT,
		backgroundColor: 'transparent',
	},
	scoresContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	scoreText: { color: 'white' },
})

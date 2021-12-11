import React, { PureComponent } from 'react'
import { Modal, StatusBar, StyleSheet, Text, View } from 'react-native'
import { GameEngine } from 'react-native-game-engine'
import { Box, Circle } from '../components/Renderers'
import { LinearGradient } from 'expo-linear-gradient'

import {
	ball,
	BALL_SIZE,
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
	hittableBall,
	collectable,
} from '../components/GameSettingsConstants'
import Matter from 'matter-js'
import {
	DeviceMotion,
	DeviceMotionMeasurement,
	ThreeAxisMeasurement,
} from 'expo-sensors'
import { Subscription } from 'expo-modules-core'
import { RootStackParamList } from '../App'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import CustomButton from '../components/CustomButton'
import { NavigationProp } from '@react-navigation/core'
import { StackScreenProps } from '@react-navigation/stack'

const BlockWOffset = BALL_SIZE / 2
const BlockHOffset = BALL_SIZE / 2 + 50

const BlockWidth = (ScreenWidth - 2 * BlockWOffset) / 2
const BlockHeight = (ScreenHeight - 4 * BlockHOffset) / 4

type State = {
	subscription: Subscription | null
	score: number
	health: number
	isGameOver: boolean
	isGameStarted: boolean
	isGamePaused: boolean
	running: boolean
	entities: { [key: string]: any }
}

export default class MarblesGame extends PureComponent<
	RootStackParamList['Marbles game'] & StackScreenProps<RootStackParamList>,
	State
> {
	physics: (
		entities: any,
		{ time }: { time: any; touches: any; dispatch: any }
	) => any
	constructor(props: any) {
		super(props)
		this.physics = (entities, { time, touches, dispatch }) => {
			if (Array.isArray(touches) && touches.length) {
				this.setState({
					isGameStarted: false,
					running: false,
				})
			}
			if (this.state.running) {
				let engine: Matter.Engine = this.state.entities['physics'].engine
				engine.gravity.y = 0
				Matter.Engine.update(engine, time.delta)
				return entities
			}
		}
		this.state = {
			score: 0,
			subscription: null,
			health: 10,
			isGameOver: false,
			entities: {},
			isGameStarted: false,
			running: false,
			isGamePaused: false,
		}
	}

	engine = Matter.Engine.create({ enableSleeping: false, gravity: {} })

	world = this.engine.world

	_slow = () => {
		DeviceMotion.setUpdateInterval(40)
	}

	_fast = () => {
		DeviceMotion.setUpdateInterval(35)
	}

	_randomCoinPosition = (x: number, y: number) => {
		const xx = Math.floor(Math.random() * BlockWidth + x) + BlockWOffset
		const yy = Math.floor(Math.random() * BlockHeight + y) + BlockHOffset
		return { xx, yy }
	}

	_coinValueRandomizer = (difficulty: 'easy' | 'hard' = 'easy') => {
		return difficulty === 'easy'
			? Math.ceil(Math.random() * 100)
			: Math.ceil(Math.random() * 1000)
	}

	_subscribe = () => {
		this.props.route.params?.difficulty === 'easy' ? this._slow() : this._fast()
		this.setState({
			subscription: DeviceMotion.addListener(
				(deviceMotion: DeviceMotionMeasurement) => {
					// Alpha is Z axis and beta is X axis and gamma Y axis
					const { beta, gamma } = deviceMotion.rotation

					Matter.Body.applyForce(
						ball,
						{
							x: ball.position.x,
							y: ball.position.y,
						},
						{ x: gamma / 1000, y: beta / 1000 }
					)
				}
			),
		})
	}

	componentDidMount() {
		Matter.World.add(this.world, [
			ball,
			topWall,
			bottomWall,
			leftWall,
			rightWall,
			snowFlake,
			collectable,
		])
		this.setState({
			entities: {},
		})
		this._subscribe()
		this._slow()
		Matter.Body.setPosition(ball, {
			x: BALL_START_POINT_X,
			y: BALL_START_POINT_Y,
		})
		Matter.Body.setVelocity(ball, {
			x: 0,
			y: 0,
		})

		const coins: Record<string, any> = {
			physics: {
				engine: this.engine,
				world: this.world,
			},
			ball: {
				body: ball,
				size: [BALL_SIZE, BALL_SIZE],
				renderer: Circle,
				color: 'ball',
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
		}
		for (let x = 0; x < ScreenWidth - 2 * BlockWOffset; x += BlockWidth) {
			for (let y = 0; y < ScreenHeight - 2 * BlockHOffset; y += BlockHeight) {
				const { xx, yy } = this._randomCoinPosition(x, y)
				const coinString = `coin-${y}-${x}`
				const coin = Matter.Bodies.circle(xx, yy, 1, {
					label: coinString,
					isSensor: true,
				})

				const coin2 = {
					body: coin,
					size: [BALL_SIZE, BALL_SIZE],
					renderer: Circle,
					color: 'gold',
					number: this._coinValueRandomizer(
						this.props.route.params?.difficulty
					),
				}

				coins[coinString] = coin2
				Matter.World.add(this.world, coin)
			}
		}
		this.setState({
			entities: coins,
		})

		Matter.Events.on(this.engine, 'collisionStart', (event: any) => {
			const pairs = event.pairs

			const getObj = (label: string) => {
				switch (label) {
					case 'ball':
						return ball
					case 'snowFlake':
						return snowFlake
					case 'hittable':
						return hittableBall
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
			if (collisionObject) {
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
				if (objB.label.includes('Wall') && objA.label === 'ball') {
					if (Math.abs(objA.velocity.x) > 2 || Math.abs(objA.velocity.y) > 2)
						this.setState({
							health: this.state.health - 1,
						})
				}
			}
			if (objB.label.includes('coin')) {
				const { xx, yy } = this._randomCoinPosition(
					Math.floor((objB.position.x - BlockWOffset) / BlockWidth) *
						BlockWidth,
					Math.floor((objB.position.y - BlockHOffset) / BlockHeight) *
						BlockHeight
				)
				Matter.Body.setPosition(objB, {
					x: xx,
					y: yy,
				})
				const numbers: number[] = []
				Object.entries(this.state.entities).map((entity) => {
					const [key, value] = entity
					if (value['number']) {
						numbers.push(value['number'])
					}
				})
				console.log(
					this.state.entities[objB.label].number,
					numbers,
					Math.min(...numbers)
				)
				const newValue = this._coinValueRandomizer(
					this.props.route.params?.difficulty
				)

				if (Math.min(...numbers) === this.state.entities[objB.label].number) {
					this.setState({
						score: this.state.score + 100,
						health: this.state.health + 1,
					})
				} else {
					this.setState({
						health: this.state.health - 1,
					})
				}
				this.state.entities[objB.label].number = newValue
				if (this.state.health <= 0) {
					this.setState({
						isGameOver: true,
						running: false,
					})
				}
			}
		})
	}

	componentWillUnmount() {
		this._unsubscribe()
		this.engine.enabled = false
	}

	_unsubscribe = () => {
		this.state.subscription && this.state.subscription.remove()
		this.setState({ running: false })
	}

	_renderStartGameModal = () => (
		<Modal style={styles.modal}>
			<LinearGradient
				style={styles.startGameModal}
				colors={['#4c669f', '#3b5998', '#192f6a']}
			>
				<View style={styles.modalContainer}>
					<Text style={styles.modalText}>
						{'Welcome to play the Marbles x Calculations'}
					</Text>
					<Text style={styles.modalText}>
						{'The game is simple, collect the numbers starting from the lowest'}
					</Text>
					<Text style={styles.modalText}>
						{
							'Avoid getting damage from the walls and collecting numbers in wrong order'
						}
					</Text>
					<Text style={styles.modalText}>
						{'Game ends when you run out of health or get your points under 0'}
					</Text>
					<View style={styles.modalButtons}>
						<CustomButton
							text={'Start game'}
							handlePress={() =>
								this.setState({
									isGameStarted: true,
									running: true,
								})
							}
						/>
						<CustomButton
							text={'To main menu'}
							handlePress={() => this.props.navigation.replace('Home')}
						/>
					</View>
				</View>
			</LinearGradient>
		</Modal>
	)
	_renderPausedGameModal = () => (
		<Modal style={styles.modal}>
			<LinearGradient
				style={styles.startGameModal}
				colors={['#4c669f', '#3b5998', '#192f6a']}
			>
				<View style={styles.modalContainer}>
					<Text style={styles.modalText}>{'Paused'}</Text>
					<Text style={styles.modalText}>
						{'The game is simple, collect the numbers starting from the lowest'}
					</Text>
					<Text style={styles.modalText}>
						{
							'Avoid getting damage from the walls and collecting numbers in wrong order'
						}
					</Text>
					<Text style={styles.modalText}>
						{'Game ends when you run out of health or get your points under 0'}
					</Text>
					<View style={styles.modalButtons}>
						<CustomButton
							text={'Continue game'}
							handlePress={() =>
								this.setState({
									isGamePaused: false,
									running: true,
								})
							}
						/>
						<CustomButton
							text={'To main menu'}
							handlePress={() => this.props.navigation.replace('Home')}
						/>
					</View>
				</View>
			</LinearGradient>
		</Modal>
	)
	_renderEndGameModal = () => (
		<Modal style={styles.modal}>
			<LinearGradient
				style={styles.startGameModal}
				colors={['#4c669f', '#3b5998', '#192f6a']}
			>
				<View style={styles.modalContainer}>
					<Text style={styles.modalText}>{'Game over!'}</Text>
					<Text style={styles.modalText}>
						{'Too bad, you game has ended, better luck next time!'}
					</Text>
					<Text style={styles.modalText}>
						{`Your score was ${this.state.score}, not too bad!`}
					</Text>
					<View style={styles.modalButtons}>
						<CustomButton
							text={'Save scores'}
							handlePress={() =>
								this.setState({
									isGameStarted: true,
									running: true,
								})
							}
						/>
						<CustomButton
							text={'To main menu'}
							handlePress={() => this.props.navigation.replace('Home')}
						/>
					</View>
				</View>
			</LinearGradient>
		</Modal>
	)

	render() {
		return !this.state.isGameStarted ? (
			this._renderStartGameModal()
		) : (
			<GameEngine
				style={styles.container}
				systems={[this.physics]}
				entities={this.state.entities}
				running={this.state.running}
			>
				<StatusBar hidden={true} />
				{this.state.isGamePaused && this._renderStartGameModal()}
				{this.state.isGameOver && this._renderEndGameModal()}
				<LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}>
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
		backgroundColor: 'green',
	},
	scoresContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	scoreText: { color: 'white' },
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
		width: '80%',
	},
	startGameModal: {
		flex: 1,
		height: 400,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalText: {
		fontSize: 20,
		color: 'white',
		maxWidth: '60%',
		marginBottom: 5,
	},
	modalContainer: {
		justifyContent: 'space-around',
		maxHeight: 600,
		zIndex: 10000,
	},
	modalButtons: {
		marginTop: 10,
		justifyContent: 'space-around',
		height: 125,
	},
})

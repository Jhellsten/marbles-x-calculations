import Matter from 'matter-js'
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('screen')

export const BALL_SIZE = 50

export const GAME_WIDTH = width
export const GAME_HEIGHT = height

export const BALL_START_POINT_X = GAME_WIDTH / 2
export const BALL_START_POINT_Y = GAME_HEIGHT / 2
export const BORDER = 15

export const wallSettings: Matter.IBodyDefinition = {
	isStatic: true,
}
const ballImg = require('../assets/cannon_ball.png')
export const ballSettings: Matter.IBodyDefinition = {
	inertia: 0.1,
	friction: 0,
	frictionStatic: 0.01,
	frictionAir: 0.005,
	restitution: 1,
	mass: 0.5,
	collisionFilter: { category: 1 },
}
export const ball = Matter.Bodies.circle(
	BALL_START_POINT_X,
	BALL_START_POINT_Y,
	BALL_SIZE,
	{
		...ballSettings,
		label: 'ball',
		render: {
			sprite: {
				texture: ballImg,
				xScale: 1,
				yScale: 1,
			},
		},
	}
)

export const collectable = Matter.Bodies.circle(
	BALL_START_POINT_X - 100,
	BALL_START_POINT_Y - 100,
	1,
	{
		label: 'collectable',
		isSensor: true,
	}
)
export const blackHole = Matter.Bodies.circle(
	BALL_START_POINT_X - 100,
	BALL_START_POINT_Y - 100,
	BALL_SIZE,
	{
		label: 'blackHole',
		isSensor: true,
		mass: 200,
		density: 1,
	}
)
export const hittableBall = Matter.Bodies.circle(
	BALL_START_POINT_X + 100,
	BALL_START_POINT_Y + 100,
	BALL_SIZE,
	{
		label: 'hittable',
		isSensor: true,
		mass: 1,
		density: 1,
		inertia: 0.1,
		friction: 0,
		frictionStatic: 0,
		frictionAir: 0.005,
		restitution: 1,
	}
)

export const snowFlake = Matter.Bodies.rectangle(2, 2, 2, 2, {
	label: 'snowFlake',
	inertia: 0.1,
	friction: 0,
	frictionStatic: 0,
	frictionAir: 0.005,
	restitution: 0,
	mass: 0.5,
})
export const topWall = Matter.Bodies.rectangle(
	GAME_WIDTH / 2,
	-35,
	GAME_WIDTH,
	BORDER,
	{
		...wallSettings,
		label: 'topWall',
		collisionFilter: { category: 1 },
	}
)
export const bottomWall = Matter.Bodies.rectangle(
	GAME_WIDTH / 2,
	GAME_HEIGHT - 60,
	GAME_WIDTH,
	BORDER,
	{ ...wallSettings, label: 'bottomWall', collisionFilter: { category: 1 } }
)
export const leftWall = Matter.Bodies.rectangle(
	-30,
	GAME_HEIGHT / 2,
	5,
	GAME_HEIGHT,
	{
		...wallSettings,
		label: 'leftWall',
		collisionFilter: { category: 1 },
	}
)
export const rightWall = Matter.Bodies.rectangle(
	GAME_WIDTH + 30,
	GAME_HEIGHT / 2,
	10,
	GAME_HEIGHT,
	{ ...wallSettings, label: 'rightWall', collisionFilter: { category: 1 } }
)

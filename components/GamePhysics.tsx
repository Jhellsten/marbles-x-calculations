import { Box } from './Renderers'
import Matter from 'matter-js'

let boxIds = 0

const distance = ([x1, y1]: any, [x2, y2]: any) =>
	Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)))

const Physics = (state: any, { touches, time }: any) => {
	let engine = state['physics'].engine

	Matter.Engine.update(engine, time.delta)

	return state
}

const CreateBox = (state: any, { touches, screen }: any) => {
	let world = state['physics'].world
	let boxSize = Math.trunc(Math.max(screen.width, screen.height) * 0.075)

	touches
		.filter((t: any) => t.type === 'press')
		.forEach((t: any) => {
			let body = Matter.Bodies.rectangle(
				t.event.pageX,
				t.event.pageY,
				boxSize,
				boxSize,
				{ frictionAir: 0.021 }
			)
			Matter.World.add(world, [body])

			state[++boxIds] = {
				body: body,
				size: [boxSize, boxSize],
				color: boxIds % 2 == 0 ? 'pink' : '#B8E986',
				renderer: Box,
			}
		})

	return state
}

const MoveBox = (state: any, { touches }: any) => {
	let constraint = state['physics'].constraint

	//-- Handle start touch
	let start = touches.find((x: any) => x.type === 'start')

	if (start) {
		let startPos = [start.event.pageX, start.event.pageY]

		let boxId = Object.keys(state).find((key) => {
			let body = state[key].body

			return body && distance([body.position.x, body.position.y], startPos) < 25
		})

		if (boxId) {
			constraint.pointA = { x: startPos[0], y: startPos[1] }
			constraint.bodyB = state[boxId].body
			constraint.pointB = { x: 0, y: 0 }
			constraint.angleB = state[boxId].body.angle
		}
	}

	//-- Handle move touch
	let move = touches.find((x: any) => x.type === 'move')

	if (move) {
		constraint.pointA = { x: move.event.pageX, y: move.event.pageY }
	}

	//-- Handle end touch
	let end = touches.find((x: any) => x.type === 'end')

	if (end) {
		constraint.pointA = null
		constraint.bodyB = null
		constraint.pointB = null
	}

	return state
}

const CleanBoxes = (state: any, { touches, screen }: any) => {
	let world = state['physics'].world

	Object.keys(state)
		.filter(
			(key) => state[key].body && state[key].body.position.y > screen.height * 2
		)
		.forEach((key) => {
			Matter.Composite.remove(world, state[key].body)
			delete state[key]
		})

	return state
}

const MoveFinger = (entities: any, { touches }: any) => {
	//-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
	//-- There's nothing stopping you from treating the game state as immutable and returning a copy..
	//-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
	//-- That said, it's probably worth considering performance implications in either case.
	touches
		.filter((t: any) => t.type === 'move')
		.forEach((t: any) => {
			let finger = entities[t.id]
			if (finger && finger.position) {
				finger.position = [
					finger.position[0] + t.delta.pageX,
					finger.position[1] + t.delta.pageY,
				]
			}
		})

	return entities
}

export { Physics, CreateBox, MoveBox, CleanBoxes, MoveFinger }

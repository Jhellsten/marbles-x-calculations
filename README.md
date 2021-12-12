# Marbles x Calculations game

This is a simple game build with Expo, Expo DeviceMotion, React Native Game Engine and Matter.js.

Firebase firestore is optional for storing highscores.

## 🚀 What does those do?

Expo is for reducing the boilerplate and getting fast into development, without the pain of installing and connecting libraries.

Expo DeviceMotion for getting device motion for moving the ball with the phone movement.

React Native Game Engine for rendering the game and controlling the updating of the game world.

Matter.JS for handling the physics engine especially for the contact calculation and ball movement calculations.

## 🚀 How to use

#### Creating a new project

For installing all the dependencies use

```sh
npm install | yarn install
```

After that just `yarn start | npm run start`

### Known bugs

- Sometimes the values are spawned outside of the screen
- Game engine does not get destroyed on unmount on sometimes -> Will calculate the ball movement unncessary
- Spawning could be improved by making empty segment, where it would be spawned after collection, instead of same segment.
- Probably bunch of others

### Adding TypeScript to existing projects

- Create a blank TypeScript config: `touch tsconfig.json`
- Run `expo start` to automatically configure TypeScript
- Rename files to TypeScript, `.tsx` for React components and `.ts` for plain typescript files

> 💡 You can disable the TypeScript setup in Expo CLI with the environment variable `EXPO_NO_TYPESCRIPT_SETUP=1 expo start`

## 📝 Notes

- [Expo TypeScript guide](https://docs.expo.dev/versions/latest/guides/typescript/)

# `port-of-mars-server`

Port Of Mars Digital Version

## :crossed_swords: Usage

## Structure

- `index.ts`: main entry point, register an empty room handler and attach [`@colyseus/monitor`](https://github.com/colyseus/colyseus-monitor)
- `MyRoom.ts`: an empty room handler for you to implement your logic
- `loadtest/example.ts`: scriptable client for the loadtest tool (see `npm run loadtest`)
- `package.json`:
    - `scripts`:
        - `yarn start`: runs `ts-node index.ts`
        - `yarn loadtest`: runs the [`@colyseus/loadtest`](https://github.com/colyseus/colyseus-loadtest/) tool for testing the connection, using the `loadtest/example.ts` script.
	- `yarn load-fixtures`: loads test data into the database
    - `dependencies`:
        - `colyseus`
        - `@colyseus/monitor`
        - `express`
    - `devDependencies`
        - `ts-node`
        - `typescript`
        - `@colyseus/loadtest`
- `tsconfig.json`: TypeScript configuration file


## License

MIT

import { EventEmitter } from 'events';
import { Socket } from 'net';

// import chalk from 'chalk';

import { Command } from './command';
import { G00, HANDSHAKE, HELLO, KEEPALIVE } from './commands';

class Connection extends EventEmitter {
	private lock: Promise<any> = Promise.resolve();
	private keepAliveTimer?: NodeJS.Timeout;

	constructor(private readonly socket: Socket) {
		super();

		this.socket.on('data', (data: Buffer) => {
			// start the lock until the end of command?

			const returnIndex = data.indexOf(13);

			console.log(
				/*chalk.green(*/ String(data.slice(0, returnIndex)) // ),
				/*chalk.whiteBright('.')*/
			);
		});
	}

	public async send<T extends object | string = any>(
		command: Command<T>
	): Promise<void> {
		await this.lock;

		this.lock = new Promise((resolve, reject) => {
			console.log(/*chalk.yellow(*/ command /*)*/);

			this.socket.write([command, ''].join('\r'), error => {
				if (error) {
					reject(error);
					return;
				}

				this.setupKeepalive();
				resolve();
			});
		});

		return this.lock;
	}

	private setupKeepalive(): void {
		if (this.keepAliveTimer) {
			clearTimeout(this.keepAliveTimer);
		}

		this.keepAliveTimer = setTimeout(async () => {
			await this.send(KEEPALIVE());
		}, 14000).unref();
	}
}

export const connect = async (
	serial: string,
	ip: string,
	port: number = 27779
) => {
	const socket = new Socket();

	try {
		await Promise.race([
			new Promise(resolve => socket.connect(port, ip, resolve)),
			new Promise((resolve, reject) =>
				// @todo better error
				// @todo make timeout value configurable
				setTimeout(() => reject('Timeout'), 1000)
			)
		]);
	} catch (e) {
		socket.destroy();
		throw e;
	}

	const connection = new Connection(socket);
	await connection.send(HELLO(serial));
	await connection.send(HANDSHAKE());
	await connection.send(G00());

	return connection;
};

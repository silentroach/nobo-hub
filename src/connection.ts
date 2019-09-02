import { EventEmitter } from 'events';
import { Socket } from 'net';

import chalk from 'chalk';

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
				chalk.green(String(data.slice(0, returnIndex))),
				chalk.whiteBright('.')
			);
		});
	}

	public async send(command: string): Promise<void> {
		await this.lock;

		this.lock = new Promise((resolve, reject) => {
			console.log(chalk.yellow(command));

			this.socket.write(command, error => {
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
	const socket = new Socket({});
	await new Promise(resolve => socket.connect(port, ip, resolve));

	const connection = new Connection(socket);
	await connection.send(HELLO(serial));
	await connection.send(HANDSHAKE());
	await connection.send(G00());

	return connection;
};

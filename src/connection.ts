import { EventEmitter } from 'events';
import { Socket } from 'net';

import chalk from 'chalk';

import { Command } from './command';
import { G00, HANDSHAKE, HELLO, KEEPALIVE } from './commands';
import { Response } from './response';
import { Y02 } from './responses';

const eventResponses: Map<string, Response> = new Map(
	[Y02].map((response) => [response.name, response])
);

class Connection extends EventEmitter {
	private currentCommand?: Command;
	private lock: Promise<any> = Promise.resolve();
	private keepAliveTimer?: NodeJS.Timeout;
	private responseQueue: any[] = [];

	constructor(private readonly socket: Socket) {
		super();

		this.socket.on('data', this.processSocketRawData.bind(this));
	}

	private processSocketRawData(data: Buffer) {
		console.log(chalk.green(String(data)));

		const returnIndex = data.indexOf(13);

		const match = String(data.slice(0, returnIndex)).match(
			/^(?<code>\w+)(:? (?<data>.*))?$/
		);

		if (!match) {
			console.error('Unexpected response data format', data, data.toString());
			throw new TypeError('Unexpected response data format');
		}

		const { code: responseCode, data: responseData } = match.groups as {
			code: string;
			data?: string;
		};

		this.processSocketData(responseCode, responseData);
	}

	private processSocketData(name: string, data?: string) {
		if (eventResponses.has(name)) {
			const response = eventResponses.get(name)!;
			if (data === undefined) {
				console.log('emitting', name);
				this.emit(name);
			} else {
				console.log(
					'emitting',
					name,
					response.handler ? response.handler(data) : data
				);
				this.emit(name, response.handler ? response.handler(data) : data);
			}

			return;
		}

		if (!this.currentCommand) {
			// as documentation said, we must ignore unknown commands
			return;
		}

		const processed = this.currentCommand.processResponse(name, data);
		if (processed !== undefined) {
			console.log(processed);
			this.responseQueue.push(processed);
		}
	}

	public async send<T extends object | string = any>(
		command: Command<T>
	): Promise<void> {
		await this.lock;

		if (this.keepAliveTimer) {
			clearTimeout(this.keepAliveTimer);
		}

		this.lock = new Promise((resolve, reject) => {
			this.currentCommand = command;
			this.responseQueue = [];

			console.log(chalk.yellow(command.toString()));

			this.socket.write([command, ''].join('\r'), (error) => {
				if (error) {
					reject(error);
					return;
				}

				// нет
				resolve();
			});
		});

		this.lock.then(() => {
			this.keepAliveTimer = setTimeout(async () => {
				await this.send(KEEPALIVE());
			}, 14000).unref();
		});

		return this.lock;
	}

	public async end() {
		await this.lock;

		if (this.keepAliveTimer) {
			clearTimeout(this.keepAliveTimer);
		}

		await new Promise((resolve) => this.socket.end(resolve));
		this.socket.destroy();
	}
}

interface Options {
	socketTimeout?: number;
}

export const connect = async (
	serial: string,
	ip: string,
	port: number = 27779,
	options: Options = {}
) => {
	const socket = new Socket();

	try {
		await Promise.race([
			new Promise((resolve) => socket.connect(port, ip, resolve)),
			new Promise((resolve, reject) =>
				// @todo better error
				setTimeout(
					() => reject('Timeout'),
					options.socketTimeout || 1000
				).unref()
			),
		]);
	} catch (e) {
		socket.destroy();
		throw e;
	}

	const connection = new Connection(socket);
	await connection.send(HELLO(serial));
	// await connection.send(HANDSHAKE());
	// await connection.send(G00());

	return connection;
};

import { createSocket, RemoteInfo } from 'dgram';

/**
 * Every two seconds, the Hub sends one UDP broadcast packet on port 10000 to broadcast IP
 * 255.255.255.255, and one UDP multicast packet on port 10001 to multicast IP 239.0.1.187.
 *
 * We use this information to discover hubs on the network and identify their current ip address
 * and the first 9 of 12 digist of
 *
 * You can use this information to discover Hubs on the network and identify their current IP address
 * and the first 9 of the 12 digits of the Hub’s unique serial number.
 *
 * The data that is sent from the Hub is the following ASCII string:
 * "__NOBOHUB__123123123", where 123123123 is replaced with the first 9 digits of the Hub’s
 * serial number. There are two underscore characters "_" before and after the "NOBOHUB" string.
 */

interface Hub {
	ip: string;

	/**
	 * First 9 of 12 characters of serial number
	 */
	serial: string;
}

interface NextPromiseQueueItem {
	resolve: (value: IteratorResult<Hub>) => void;
	reject: (reason?: any) => void;
}

/**
 * Iterate over unique hub ips, will run for ~4 seconds or until you break the loop
 */
export const discover = (): AsyncIterableIterator<Hub> => {
	const discovered = new Set<string>();

	let isDone = false;
	const queue: Hub[] = [];
	const next: NextPromiseQueueItem[] = [];
	let error: Error | undefined;
	let hasPendingError = false;

	const messageHandler = (messageBuffer: Buffer, remote: RemoteInfo) => {
		const message = String(messageBuffer);

		const matches = message.match(/^__NOBOHUB__(?<serial>\d{9})$/);
		if (!matches) {
			// skipping unknown message
			return;
		}

		const { address: ip } = remote;
		if (!discovered.has(ip)) {
			discovered.add(ip);

			const value: Hub = { ip, serial: matches.groups!.serial };

			if (next.length > 0) {
				const { resolve } = next.shift()!;
				resolve({ done: false, value });

				return;
			}

			queue.push(value);
		}
	};

	const broadcastServer = createSocket({ type: 'udp4', reuseAddr: true });
	broadcastServer.bind(10000);

	const multicastServer = createSocket({ type: 'udp4', reuseAddr: true });
	multicastServer.bind(10001, () => {
		multicastServer.addMembership('239.0.1.187');
	});

	const servers = [broadcastServer, multicastServer];

	let timeout: NodeJS.Timeout;

	const cancel = () => {
		isDone = true;

		clearTimeout(timeout);

		servers.map((server) => server.off('message', messageHandler).close());

		while (next.length > 0) {
			const { resolve } = next.shift()!;
			resolve({ done: true, value: undefined });
		}
	};

	servers.forEach((server) => {
		server.on('message', messageHandler).on('error', (socketError) => {
			error = socketError;

			if (next.length > 0) {
				const { reject } = next.shift()!;
				reject(error);
			} else {
				hasPendingError = true;
			}

			cancel();
		});
	});

	// hub sends broadcast every 2 seconds, so we don't need to wait for a next announce
	timeout = setTimeout(() => cancel(), 2200);

	return {
		[Symbol.asyncIterator]() {
			return this;
		},

		async next() {
			if (queue.length > 0) {
				const value = queue.shift()!;

				return {
					done: isDone && queue.length === 0,
					value,
				};
			}

			if (hasPendingError) {
				hasPendingError = false;
				throw error;
			}

			if (isDone) {
				return { done: true, value: undefined };
			}

			return new Promise((resolve, reject) => next.push({ resolve, reject }));
		},

		async return(value: Hub) {
			cancel();
			return { done: isDone, value };
		},
	};
};

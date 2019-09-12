import { createSocket, RemoteInfo } from 'dgram';

/*

Every two seconds, the Hub sends one UDP broadcast packet on port 10000 to broadcast IP
255.255.255.255, and one UDP multicast packet on port 10001 to multicast IP 239.0.1.187.

You can use this information to discover Hubs on the network and identify their current IP address
and the first 9 of the 12 digits of the Hub’s unique serial number.1
The data that is sent from the Hub is the following ASCII string:
"__NOBOHUB__123123123", where 123123123 is replaced with the first 9 digits of the Hub’s
serial number. There are two underscore characters "_" before and after the "NOBOHUB" string.

 */

interface Hub {
	ip: string;

	/**
	 * First 9 of 12 characters of serial number
	 */
	serial: string;
}

/**
 * Iterate over unique hub ips, will run for ~4 seconds or until you break the loop
 */
export const discover = (): AsyncIterableIterator<Hub> => {
	let isDone = false;
	const discovered = new Set<string>();
	const queue: Hub[] = [];
	const next: ((value?: IteratorResult<Hub>) => void)[] = [];

	const messageHandler = (messageBuffer: Buffer, remote: RemoteInfo) => {
		const ip = remote.address;
		const message = String(messageBuffer);

		const matches = message.match(/^__NOBOHUB__(?<serial>\d{9})$/);
		if (!matches) {
			console.warn(`Skipping unknown message from ${ip}: ${message}`);
			return;
		}

		if (!discovered.has(ip)) {
			discovered.add(ip);

			const value: Hub = { ip, serial: matches.groups!.serial };

			if (next.length > 0) {
				const resolve = next.shift()!;
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

	servers.forEach(server => {
		server.on('message', messageHandler).on('error', error => {
			console.error('Discovery server error', error);
		});
	});

	let timeout: NodeJS.Timeout;

	const cancel = () => {
		isDone = true;

		clearTimeout(timeout);

		servers.map(server => server.off('message', messageHandler).close());

		while (next.length > 0) {
			const resolve = next.shift()!;
			resolve({ done: true, value: undefined });
		}
	};

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
					value
				};
			}

			if (isDone) {
				return { done: true, value: undefined };
			}

			return new Promise(resolve => next.push(resolve));
		},

		async return(value: Hub) {
			cancel();
			return { done: isDone, value };
		}
	};
};

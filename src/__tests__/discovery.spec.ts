import dgram from 'dgram';

import { discover } from '../discovery';

it('discover hubs by udp broadcast to 10000 port', async () => {
	const serialPart = '123456789';
	const client = dgram.createSocket('udp4');

	const send = (message: string): void => {
		client.send(message, 0, message.length, 10000, '127.0.0.1');
	};

	setTimeout(() => send('some message'), 100);
	setTimeout(() => send(`__NOBOHUB__${serialPart}`), 200);

	// should be ignored (already discovered)
	setTimeout(() => send(`__NOBOHUB__${serialPart}`), 300);

	const discovered = [];
	for await (const hub of discover()) {
		if (hub.ip !== '127.0.0.1') {
			// real hub
			continue;
		}

		discovered.push(hub);
	}

	client.close();

	expect(discovered.length).toBe(1);

	const [hub] = discovered;

	expect(hub.ip).toBe('127.0.0.1');
	expect(hub.serial).toBe(serialPart);
});

it('stop to listen after loop break', async () => {
	const client = dgram.createSocket('udp4');

	const send = (message: string): void => {
		client.send(message, 0, message.length, 10000, '127.0.0.1');
	};

	const sendMock = jest.fn(() => send('__NOBOHUB__987654321'));

	setTimeout(() => send(`__NOBOHUB__123456789`), 200);
	setTimeout(sendMock, 300); // not listening

	const discovered = [];
	for await (const hub of discover()) {
		if (hub.ip !== '127.0.0.1') {
			// real hub
			continue;
		}

		discovered.push(hub);
		break;
	}

	// waiting for 300 timeout to trigger
	await new Promise((resolve) => setTimeout(resolve, 500));

	client.close();

	expect(sendMock).toBeCalled();
	expect(discovered.length).toBe(1);
});

import dgram from 'dgram';

import test from 'ava';

import { discover } from '../discovery';

test.serial('discover hubs by udp broadcast to 10000 port', async (t) => {
	const serialPart = '123456789';
	const client = dgram.createSocket('udp4');

	const send = (message: string): void => {
		client.send(message, 0, message.length, 10000, '127.0.0.1');
	};

	setTimeout(() => send('some message'), 100);
	setTimeout(() => send(`__NOBOHUB__${serialPart}`), 200);
	setTimeout(() => send(`__NOBOHUB__${serialPart}`), 300); // should be ignored (already discovered)

	const discovered = [];
	for await (const hub of discover()) {
		if (hub.ip !== '127.0.0.1') {
			// real hub
			continue;
		}

		discovered.push(hub);
	}

	client.close();

	t.is(discovered.length, 1, 'Invalid discovered hubs count');

	const [hub] = discovered;

	t.is(hub.ip, '127.0.0.1');
	t.is(hub.serial, serialPart);
});

test.serial('stop to listen after loop break', async (t) => {
	const client = dgram.createSocket('udp4');

	t.plan(2);

	const send = (message: string): void => {
		client.send(message, 0, message.length, 10000, '127.0.0.1');
	};

	setTimeout(() => send(`__NOBOHUB__123456789`), 200);
	setTimeout(() => {
		send(`__NOBOHUB__987654321`);
		t.pass();
	}, 300); // not listening

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

	t.is(discovered.length, 1, 'Invalid discovered hubs count');
});

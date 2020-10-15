import { discover } from '../';

(async () => {
	console.log('Trying to discover Nobø Hubs in local network...');

	let count = 0;
	for await (const { ip, serial } of discover()) {
		++count;

		console.log('Hub discovered:', {
			ip,
			serial: [serial, 'xxx'].join(''),
		});
	}

	console.log(
		'Discovery finished,',
		count === 0 ? 'nothing found' : `total hubs found: ${count}`
	);
})();

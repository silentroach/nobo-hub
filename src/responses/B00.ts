import { deserialize, Zone } from '../structures/Zone';

export const B00 = (input: string): Zone => deserialize(input);

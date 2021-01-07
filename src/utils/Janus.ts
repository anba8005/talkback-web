/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const Janus = require('janus-gateway-js');

export interface StreamingPlugin extends Plugin {
	connect: (id: number, options: any) => Promise<any>;
	start: () => Promise<any>;
	pause: () => Promise<any>;
	_pc: RTCPeerConnection;
}

export interface AudioBridgePlugin extends Plugin {
	getUserMedia: (options: any) => Promise<MediaStream>;
	offerStream: (
		stream: MediaStream,
		options: any,
		configure: any,
	) => Promise<any>;
	listParticipants: (id: number) => Promise<any>;
	configure: (options: any) => Promise<any>;
	connect: (id: number, options: any) => Promise<any>;
}

export interface Plugin {
	detach: () => void;
	on: (event: string, handler: (event: any) => void) => void;
}

export interface Session {
	attachPlugin: <T extends Plugin>(name: string) => Promise<T>;
}

export interface Connection {
	createSession: () => Promise<Session>;
}

export interface Client {
	createConnection: () => Promise<Connection>;
}

export const AudioBridgePluginName = Janus.AudiobridgePlugin.NAME;
export const StreamingPluginName = Janus.StreamingPlugin.NAME;

export default Janus;

import { AudioBridgeService } from '../common/services/AudioBridgeService';
import { SessionService } from '../common/services/SessionService';
import { StreamingService } from '../common/services/StreamingService';
import { AbstractRootStore } from '../common/stores/AbstractRootStore';

export class RootStore extends AbstractRootStore {
	constructor(
		sessionService: SessionService,
		audioBridgeService: AudioBridgeService,
		streamingService: StreamingService,
	) {
		super(sessionService, audioBridgeService, streamingService);
	}
}

export function createRootStore(): RootStore {
	const sessionService = new SessionService();
	const audioBridgeService = new AudioBridgeService(sessionService);
	const streamingService = new StreamingService(sessionService);
	return new RootStore(sessionService, audioBridgeService, streamingService);
}

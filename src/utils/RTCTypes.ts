export type CRTCPeerConnection = RTCPeerConnection;
export type CMediaStream = MediaStream;
export type CRTCDataChannel = RTCDataChannel;
export const getUserMedia = (constraints: any) => {
	return navigator.mediaDevices.getUserMedia(constraints);
};

export const reactNative = false;

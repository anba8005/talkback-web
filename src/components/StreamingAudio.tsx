import { makeStyles } from '@material-ui/core';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

const useStyles = makeStyles({
	invisible: {
		position: 'absolute',
		zIndex: -9999,
	},
});

export interface StreamingAudioProps {
	stream: MediaStream | null;
	muted: boolean;
}

const StreamingAudio: FunctionalComponent<StreamingAudioProps> = ({
	stream,
	muted,
}: StreamingAudioProps) => {
	const ref = useRef<HTMLAudioElement>(null);
	//
	useEffect(() => {
		const audio = ref.current;
		if (audio && stream !== audio.srcObject) {
			audio.srcObject = stream;
		}
	}, [stream]);
	//
	const classes = useStyles();
	return (
		<audio
			className={classes.invisible}
			autoPlay={true}
			playsInline={true}
			ref={ref}
			muted={muted}
		/>
	);
};

export default StreamingAudio;

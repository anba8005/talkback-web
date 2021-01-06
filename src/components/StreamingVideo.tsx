import { makeStyles } from '@material-ui/core';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { memo } from 'preact/compat';
import VideocamOff from '@material-ui/icons/VideocamOff';

const useStyles = makeStyles({
	video: {
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	indicator: {
		height: '50%',
		width: '50%',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export interface StreamingVideoProps {
	stream: MediaStream | null;
	muted: boolean;
	className?: string;
}

const StreamingVideo: FunctionalComponent<StreamingVideoProps> = ({
	stream,
	muted,
}: StreamingVideoProps) => {
	const ref = useRef<HTMLVideoElement>(null);
	//
	useEffect(() => {
		const video = ref.current;
		if (video && stream !== video.srcObject) {
			video.srcObject = stream;
		}
	}, [stream]);
	//
	const classes = useStyles();
	return (
		<video
			autoPlay={true}
			playsInline={true}
			ref={ref}
			muted={muted}
			className={classes.video}
		/>
	);
};

export default memo<StreamingVideoProps>(function StreamingVideoWrapper({
	stream,
	muted,
	className,
}) {
	const classes = useStyles();
	return (
		<div className={className}>
			{stream ? (
				<StreamingVideo stream={stream} muted={muted} />
			) : (
				<VideocamOff className={classes.indicator} />
			)}
		</div>
	);
});

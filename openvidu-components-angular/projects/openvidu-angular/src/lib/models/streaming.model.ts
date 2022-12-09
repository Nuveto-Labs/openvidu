export enum StreamingStatus {
	STARTING = 'starting',
	STARTED = 'started',
	STOPPING = 'stopping',
	STOPPED = 'stopped',
	FAILED = 'failed'
}


export interface StreamingInfo {
	id: string,
	status: StreamingStatus
}
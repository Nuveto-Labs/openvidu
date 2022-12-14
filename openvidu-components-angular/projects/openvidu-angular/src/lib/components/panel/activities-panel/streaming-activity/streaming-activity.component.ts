import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { skip, Subscription } from 'rxjs';
import { Signal } from '../../../../models/signal.model';
import { StreamingInfo, StreamingStatus } from '../../../../models/streaming.model';
import { OpenViduAngularConfigService } from '../../../../services/config/openvidu-angular.config.service';
import { OpenViduService } from '../../../../services/openvidu/openvidu.service';
import { ParticipantService } from '../../../../services/participant/participant.service';
import { StreamingService } from '../../../../services/streaming/streaming.service';

/**
 * @internal
 */
@Component({
	selector: 'ov-streaming-activity',
	templateUrl: './streaming-activity.component.html',
	styleUrls: ['./streaming-activity.component.css', '../activities-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamingActivityComponent implements OnInit {
	/**
	 * Provides event notifications that fire when start streaming button has been clicked.
	 * The streaming should be started using the REST API.
	 */
	@Output() onStartStreamingClicked: EventEmitter<string> = new EventEmitter<string>();

	/**
	 * Provides event notifications that fire when stop streaming button has been clicked.
	 * The streaming should be stopped using the REST API.
	 */
	@Output() onStopStreamingClicked: EventEmitter<void> = new EventEmitter<void>();

	/**
	 * @internal
	 */
	urlRequiredError: boolean = false;

	/**
	 * @internal
	 */
	oldStreamingStatus: StreamingStatus;
	/**
	 * @internal
	 */
	rtmpUrl: string = '';

	/**
	 * @internal
	 */
	@Input() expanded: boolean;

	/**
	 * @internal
	 */
	streamingError: string | undefined;

	/**
	 * @internal
	 */
	streamingStatus: StreamingStatus = StreamingStatus.STOPPED;
	/**
	 * @internal
	 */
	streamingStatusEnum = StreamingStatus;
	opened: boolean = false;
	private streamingSub: Subscription;
	private streamingInfoSub: Subscription;
	private streamingErrorSub: Subscription;
	isSessionCreator: boolean = false;

	constructor(
		private streamingService: StreamingService,
		private participantService: ParticipantService,
		private openviduService: OpenViduService,
		private libService: OpenViduAngularConfigService,
		private cd: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.isSessionCreator = this.participantService.amIModerator();
		this.subscribeToStreamingStatus();
		this.subscribeToStreamingInfo();
		this.subscribeToStreamingError();
	}

	ngOnDestroy() {
		if (this.streamingSub) this.streamingSub.unsubscribe();
		if (this.streamingInfoSub) this.streamingInfoSub.unsubscribe();
		if (this.streamingErrorSub) this.streamingErrorSub.unsubscribe();
	}

	/**
	 * @internal
	 */
	panelOpened() {
		this.opened = true;
	}

	/**
	 * @internal
	 */
	panelClosed() {
		this.opened = false;
	}

	/**
	 * @ignore
	 */
	eventKeyPress(event) {
		// Pressed 'Enter' key
		if (event && event.keyCode === 13) {
			event.preventDefault();
			this.startStreaming();
		}
	}

	startStreaming() {
		if (!!this.rtmpUrl) {
			this.streamingError = undefined;
			this.onStartStreamingClicked.emit(this.rtmpUrl);
			this.streamingService.updateStatus(StreamingStatus.STARTING);
			if (this.isSessionCreator) {
				//TODO: Remove it when RTMP Exported was included on OV and streaming ready event was fired.
				this.openviduService.sendSignal(Signal.STREAMING_STARTED);
			}
		}
		this.urlRequiredError = !this.rtmpUrl;
	}

	stopStreaming() {
		this.onStopStreamingClicked.emit();
		this.streamingService.updateStatus(StreamingStatus.STOPPING);
		if (this.isSessionCreator) {
			//TODO: Remove it when RTMP Exported was included on OV and streaming ready event was fired.
			this.openviduService.sendSignal(Signal.STREAMING_STOPPED);
		}
	}

	private subscribeToStreamingStatus() {
		this.streamingSub = this.streamingService.streamingStatusObs
			.pipe(skip(1))
			.subscribe((ev: { status: StreamingStatus; time?: Date } | undefined) => {
				if (!!ev) {
					this.streamingStatus = ev.status;
					this.cd.markForCheck();
				}
			});
	}

	//TODO: Remove this directive when RTMP Exported was included on OV and streaming ready event was fired.
	private subscribeToStreamingInfo() {
		this.streamingInfoSub = this.libService.streamingInfoObs.subscribe((info: StreamingInfo | undefined) => {
			if (!!info) {
				this.streamingService.updateStatus(info.status);
				this.cd.markForCheck();
			}
		});
	}

	private subscribeToStreamingError() {
		this.streamingErrorSub = this.libService.streamingErrorObs.subscribe((error: string | undefined) => {
			if (!!error) {
				this.streamingError = error;
				this.streamingService.updateStatus(StreamingStatus.FAILED);
				this.cd.markForCheck();
			}
		});
	}
}

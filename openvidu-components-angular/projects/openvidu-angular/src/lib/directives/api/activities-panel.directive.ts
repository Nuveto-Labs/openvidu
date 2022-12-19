import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { StreamingError, StreamingInfo, StreamingStatus } from '../../models/streaming.model';
import { OpenViduAngularConfigService } from '../../services/config/openvidu-angular.config.service';

/**
 * The **recordingActivity** directive allows show/hide the recording activity in {@link ActivitiesPanelComponent}.
 *
 * Default: `true`
 *
 * It can be used in the parent element {@link VideoconferenceComponent} specifying the name of the `activitiesPanel` component:
 *
 * @example
 * <ov-videoconference [activitiesPanelRecordingActivity]="false"></ov-videoconference>
 *
 * \
 * And it also can be used in the {@link ActivitiesPanelComponent}.
 * @example
 * <ov-activities-panel *ovActivitiesPanel [recordingActivity]="false"></ov-activities-panel>
 */
@Directive({
	selector: 'ov-videoconference[activitiesPanelRecordingActivity], ov-activities-panel[recordingActivity]'
})
export class ActivitiesPanelRecordingActivityDirective implements AfterViewInit, OnDestroy {
	@Input() set activitiesPanelRecordingActivity(value: boolean) {
		this.recordingActivityValue = value;
		this.update(this.recordingActivityValue);
	}
	@Input() set recordingActivity(value: boolean) {
		this.recordingActivityValue = value;
		this.update(this.recordingActivityValue);
	}

	recordingActivityValue: boolean = true;

	constructor(public elementRef: ElementRef, private libService: OpenViduAngularConfigService) {}

	ngAfterViewInit() {
		this.update(this.recordingActivityValue);
	}
	ngOnDestroy(): void {
		this.clear();
	}
	clear() {
		this.recordingActivityValue = true;
		this.update(true);
	}

	update(value: boolean) {
		if (this.libService.recordingActivity.getValue() !== value) {
			this.libService.recordingActivity.next(value);
		}
	}
}

/**
 * The **streamingActivity** directive allows show/hide the streaming activity in {@link ActivitiesPanelComponent}.
 *
 * Default: `true`
 *
 * It can be used in the parent element {@link VideoconferenceComponent} specifying the name of the `activitiesPanel` component:
 *
 * @example
 * <ov-videoconference [activitiesPanelStreamingActivity]="false"></ov-videoconference>
 *
 * \
 * And it also can be used in the {@link ActivitiesPanelComponent}.
 * @example
 * <ov-activities-panel *ovActivitiesPanel [streamingActivity]="false"></ov-activities-panel>
 */
 @Directive({
	selector: 'ov-videoconference[activitiesPanelStreamingActivity], ov-activities-panel[streamingActivity]'
})
export class ActivitiesPanelStreamingActivityDirective implements AfterViewInit, OnDestroy {
	@Input() set activitiesPanelStreamingActivity(value: boolean) {
		this.streamingActivityValue = value;
		this.update(this.streamingActivityValue);
	}
	@Input() set streamingActivity(value: boolean) {
		this.streamingActivityValue = value;
		this.update(this.streamingActivityValue);
	}

	streamingActivityValue: boolean = true;

	constructor(public elementRef: ElementRef, private libService: OpenViduAngularConfigService) {}

	ngAfterViewInit() {
		this.update(this.streamingActivityValue);
	}
	ngOnDestroy(): void {
		this.clear();
	}
	clear() {
		this.streamingActivityValue = true;
		this.update(true);
	}

	update(value: boolean) {
		if (this.libService.streamingActivity.getValue() !== value) {
			this.libService.streamingActivity.next(value);
		}
	}
}

/**
 * The **streamingError** directive allows to show any possible error with the streaming in the {@link ActivitiesPanelComponent}.
 *
 * Default: `undefined`
 * Type: {@link StreamingError}
 *
 * It can be used in the parent element {@link VideoconferenceComponent} specifying the name of the `streamingActivity` component:
 *
 * @example
 * <ov-videoconference [streamingActivityStreamingError]="error"></ov-videoconference>
 *
 * \
 * And it also can be used in the {@link ActivitiesPanelComponent}.
 * @example
 * <ov-activities-panel [streamingError]="error"></ov-activities-panel>
 */
@Directive({
	selector: 'ov-videoconference[streamingActivityStreamingError], ov-activities-panel[streamingError]'
})
export class StreamingActivityStreamingErrorDirective implements AfterViewInit, OnDestroy {
	@Input() set streamingActivityStreamingError(value: StreamingError) {
		this.streamingErrorValue = value;
		this.update(this.streamingErrorValue);
	}
	@Input() set streamingError(value: StreamingError) {
		this.streamingErrorValue = value;
		this.update(this.streamingErrorValue);
	}

	streamingErrorValue: StreamingError | undefined = undefined;

	constructor(public elementRef: ElementRef, private libService: OpenViduAngularConfigService) {}

	ngAfterViewInit() {
		this.update(this.streamingErrorValue);
	}
	ngOnDestroy(): void {
		this.clear();
	}
	clear() {
		this.streamingErrorValue = undefined;
		this.update(undefined);
	}

	update(value: StreamingError | undefined) {
		if (this.libService.streamingError.getValue() !== value) {
			this.libService.streamingError.next(value);
		}
	}
}

//TODO: Remove this directive when RTMP Exported was included on OV and streaming ready event was fired.

/**
 * The **streamingInfo** directive allows show the live streaming info in {@link ActivitiesPanelComponent}.
 *
 * Default: `undefined`
 * Type: {@link StreamingInfo}
 *
 * It can be used in the parent element {@link VideoconferenceComponent} specifying the name of the `streamingActivity` component:
 *
 * @example
 * <ov-videoconference [streamingActivityStreamingInfo]="info"></ov-videoconference>
 *
 * \
 * And it also can be used in the {@link ActivitiesPanelComponent}.
 * @example
 * <ov-activities-panel [streamingInfo]="info"></ov-activities-panel>
 */
@Directive({
	selector: 'ov-videoconference[streamingActivityStreamingInfo], ov-activities-panel[streamingInfo]'
})
export class StreamingActivityStreamingInfoDirective implements AfterViewInit, OnDestroy {
	@Input() set streamingActivityStreamingInfo(value: StreamingInfo) {
		this.streamingValue = value;
		this.update(this.streamingValue);
	}
	@Input() set streamingInfo(value: StreamingInfo) {
		this.streamingValue = value;
		this.update(this.streamingValue);
	}

	streamingValue: StreamingInfo | undefined = undefined;

	constructor(public elementRef: ElementRef, private libService: OpenViduAngularConfigService) {}

	ngAfterViewInit() {
		this.update(this.streamingValue);
	}
	ngOnDestroy(): void {
		this.clear();
	}
	clear() {
		this.streamingValue = undefined;
		this.update(undefined);
	}

	update(value: StreamingInfo | undefined) {
		if (this.libService.streamingInfo.getValue() !== value) {
			if(value) {
				// Forced value to right enum
				const index = Object.values(StreamingStatus).indexOf(value.status.toLowerCase()  as unknown as StreamingStatus);
				const key = Object.keys(StreamingStatus)[index];
				value.status = StreamingStatus[key];
			}
			this.libService.streamingInfo.next(value);
		}
	}
}

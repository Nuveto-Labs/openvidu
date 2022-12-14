import { Directive, AfterViewInit, OnDestroy, Input, ElementRef } from '@angular/core';
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
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
  HostListener,
	OnInit,
	ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../../../models/chat.model';
import { ChatConfig } from '../../../models/chatconfig.model';
import { PanelType } from '../../../models/panel.model';
import { ChatService } from '../../../services/chat/chat.service';
import { PanelService } from '../../../services/panel/panel.service';
import moment from 'moment';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { TranslateService } from '../../../services/translate/translate.service';
import { INotificationOptions } from '../../../models/notification-options.model';

/**
 *
 * The **ChatPanelComponent** is hosted inside of the {@link PanelComponent}.
 * It is in charge of displaying the session chat.
 *
 * <div class="custom-table-container">

 * <div>
 *
 * <h3>OpenVidu Angular Directives</h3>
 *
 * The ChatPanelComponent can be replaced with a custom component. It provides us the following {@link https://angular.io/guide/structural-directives Angular structural directives}
 * for doing this.
 *
 * |            **Directive**           |                 **Reference**                 |
 * |:----------------------------------:|:---------------------------------------------:|
 * |           ***ovChatPanel**          |           {@link ChatPanelDirective}          |
 *
 * <p class="component-link-text">
 * 	<span class="italic">See all {@link OpenViduAngularDirectiveModule OpenVidu Angular Directives}</span>
 * </p>
 * </div>
 * </div>
 */
@Component({
	selector: 'ov-chat-panel',
	templateUrl: './chat-panel.component.html',
	styleUrls: ['../panel.component.css','./chat-panel.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatPanelComponent implements OnInit, AfterViewInit {
	/**
	 * @ignore
	 */
	@ViewChild('chatScroll') chatScroll: ElementRef;
	/**
	 * @ignore
	 */
	@ViewChild('chatInput') chatInput: ElementRef;
	/**
	 * @ignore
	 */
	message: string = "";

	messageList: ChatMessage[] = [];

  file: File | null = null;

  recording: boolean = false;
  recorded: boolean = false;
  playing: boolean = false;

  audios:  Map<string, WaveSurfer> = new Map();
  currentAudio: string = '';

  config: ChatConfig = {
    dateFormat: 'HH:mm',
    canSendFiles: true,
    canSendAudio: true,
    canReply: true,
    canReact: true,
  };

  wavesurfer: WaveSurfer;

  record: any;

	private chatMessageSubscription: Subscription;
  private messageSound: HTMLAudioElement;

	/**
	 * @ignore
	 */
	constructor(private chatService: ChatService, private panelService: PanelService, private cd: ChangeDetectorRef, private translateService: TranslateService) {
    	this.messageSound = new Audio('data:audio/wav;base64,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');
		  this.messageSound.volume = 0.6;
  }

	ngOnInit() {
		this.subscribeToMessages();
    const el = document.querySelector('openvidu-webcomponent');
    if(el){
      const config = el.getAttribute('chat-config');
      if(config){
        try {
          this.config = {...this.config, ...JSON.parse(config)};
        } catch (e) {
          console.error('Error parsing chat-config', e);
        }
      }
    }
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.scrollToBottom();
			this.chatInput.nativeElement.focus();
		}, 300);
	}

	ngOnDestroy(): void {
		if (this.chatMessageSubscription) this.chatMessageSubscription.unsubscribe();
	}

	/**
	 * @ignore
	 */
	eventKeyPress(event) {
		// Pressed 'Enter' key
		if (event && event.keyCode === 13) {
			event.preventDefault();
			this.sendMessage();
		}
	}

  @HostListener('window:SigmaChatNewMessage', ['$event'])
	async handleNewMessage(event) {
    var message = event.detail;
    if(!message.type){
      message.type = 'text';
    }
    message.type = message.type == 'text/html' ? 'html' : message.type.split('/')[0];
    message.type = ['image', 'video', 'audio', 'html', 'text'].includes(message.type) ? message.type : 'document'

		this.messageList.push(message);

    if (this.panelService.isChatPanelOpened()) {
      this.scrollToBottom();
      this.cd.markForCheck();
    }

    if (message.type.includes('audio')) {
      await this.delay(100);
      this.audios.set(message.id, WaveSurfer.create({
        container: `#waveform-${message.id}`,
        waveColor: getComputedStyle(document.body)?.getPropertyValue('--sigma-primary-color') || '#2c40f5',
        progressColor: getComputedStyle(document.body)?.getPropertyValue('--sigma-secondary-color') || '#27d76d',
        width: 100,
        height: 60,
        barWidth: 4,
        barGap: 5,
        barRadius: 10,
        cursorColor: 'none'
      }));
      const wavesurfer = this.audios.get(message.id);
      if (wavesurfer == undefined) {
        return;
      }
      wavesurfer.load(message.attachment);
      /** When the audio is both decoded and can play */
      wavesurfer.on('ready', (duration) => {
        var msg = document.getElementById(`sigma-message-${message.id}`);
        if(!msg){ return; }
        let totalSeconds = duration; // replace with your time in seconds
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const el = msg.querySelector('.sigma-time-audio')
        if(el){
          (el as HTMLElement).innerText = formattedTime;
        }
      });
      /** When the audio starts playing */
      wavesurfer.on('play', () => {
        var msg = document.getElementById(`sigma-message-${message.id}`);
        if(!msg){ return; }
        const el = msg.querySelector('.sigma-btn-play')
        if(el) (el as HTMLElement).style.display = 'none';
        const el2 =msg.querySelector('.sigma-btn-pause')
        if(el2) (el2 as HTMLElement).style.display = 'block';
      })
      
      /** When the audio pauses */
      wavesurfer.on('pause', () => {
        var msg = document.getElementById(`sigma-message-${message.id}`);
        if(!msg){ return; }

        const el = msg.querySelector('.sigma-btn-play')
        if(el) (el as HTMLElement).style.display = 'block';
        const el2 =msg.querySelector('.sigma-btn-pause')
        if(el2) (el2 as HTMLElement).style.display = 'none';
      })

      /** On audio position change, fires continuously during playback */
      wavesurfer.on('timeupdate', (currentTime) => {
        var msg = document.getElementById(`sigma-message-${message.id}`);
        if(!msg){ return; }
        let totalSeconds = currentTime; // replace with your time in seconds
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const el = msg.querySelector('.sigma-time-audio');
        if(el) (el as HTMLElement).innerText = formattedTime;
      })
    }
	}

  @HostListener('window:SigmaChatStatusMessage', ['$event'])
	handleStatusMessage(event) {
    var order = {
      'sending': 1,
      'failed': 2,
      'sent': 3,
      'delivered': 4,
      'read': 5,
    }
		const index = this.messageList.findIndex((message) => event.detail.id == message.id);
    if(index > -1){
      var oldStatus = this.messageList[index].status || 'sending';
      if(order[oldStatus] > order[event.detail.status]){
        return;
      }
      this.messageList[index].status = event.detail.status;
      this.cd.detectChanges();
    }
	}

  @HostListener('window:SigmaChatFileMessage', ['$event'])
	handleFileMessage(event) {
		const index = this.messageList.findIndex((message) => event.detail.id == message.id);
    if(index > -1){
      this.messageList[index].attachment = event.detail.attachment;
      this.cd.detectChanges();
    }
	}

	@HostListener('window:SigmaChatClear', ['$event'])
	handleClear(event) {
		this.messageList = [];
	}

	sendMessage(): void {
    if (this.file){
      this.sendMedia();
      return;
    }
    if (this.config.canSendAudio && (this.message == '')) {
      this.recording = !this.recording;
      this.wavesurfer  = WaveSurfer.create({
        container: '#mic',
        waveColor: getComputedStyle(document.body)?.getPropertyValue('--sigma-primary-color') || '#2c40f5',
        progressColor: getComputedStyle(document.body)?.getPropertyValue('--sigma-secondary-color') || '#27d76d',
        height: 35,
      });
      this.record = this.wavesurfer.registerPlugin(RecordPlugin.create({ scrollingWaveform: false, renderRecordedAudio: false }))
      this.record.on('record-end', (blob) => {
        const recordedUrl = URL.createObjectURL(blob);
        this.file = new File([blob], "agentAudio.webm", { type: 'audio/webm' });
        this.wavesurfer.destroy();
        // Create wavesurfer from the recorded audio
        this.wavesurfer = WaveSurfer.create({
          container: '#mic',
          url: recordedUrl,
          height: 35,
          waveColor: getComputedStyle(document.body)?.getPropertyValue('--sigma-primary-color') || '#2c40f5',
          progressColor: getComputedStyle(document.body)?.getPropertyValue('--sigma-secondary-color') || '#27d76d',
          barWidth: 4,
          barRadius: 10,
          cursorWidth: 0
        });
        this.wavesurfer.on('finish', () => {
          this.finish();
        });
      })
      this.record.startRecording();
      return;
    }
		if (!!this.message) {
			this.chatService.sendMessage(this.message);
			this.message = '';
		}
	}

  async sendMedia() {
    if(this.file == null){
      return;
    }
    const id = this.chatService.sendMedia(this.file);

    if (this.file.type.includes('audio')) {
      await this.delay(100);
      this.audios.set(id, WaveSurfer.create({
        container: `#waveform-${id}`,
        waveColor: getComputedStyle(document.body)?.getPropertyValue('--sigma-primary-color') || '#2c40f5',
        progressColor: getComputedStyle(document.body)?.getPropertyValue('--sigma-secondary-color') || '#27d76d',
        width: 100,
        height: 60,
        barWidth: 4,
        barGap: 5,
        barRadius: 10,
        cursorColor: 'none'
      }));
      const wavesurfer = this.audios.get(id);
      if (wavesurfer == undefined) {
        return;
      }
      wavesurfer.loadBlob(this.file);
      /** When the audio is both decoded and can play */
      wavesurfer.on('ready', (duration) => {
        var msg = document.getElementById(`sigma-message-${id}`);
        if(!msg){ return; }
        let totalSeconds = duration; // replace with your time in seconds
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const el = msg.querySelector('.sigma-time-audio')
        if(el){
          (el as HTMLElement).innerText = formattedTime;
        }
      });
      /** When the audio starts playing */
      wavesurfer.on('play', () => {
        var msg = document.getElementById(`sigma-message-${id}`);
        if(!msg){ return; }
        const el = msg.querySelector('.sigma-btn-play')
        if(el) (el as HTMLElement).style.display = 'none';
        const el2 =msg.querySelector('.sigma-btn-pause')
        if(el2) (el2 as HTMLElement).style.display = 'block';
      })
      
      /** When the audio pauses */
      wavesurfer.on('pause', () => {
        var msg = document.getElementById(`sigma-message-${id}`);
        if(!msg){ return; }

        const el = msg.querySelector('.sigma-btn-play')
        if(el) (el as HTMLElement).style.display = 'block';
        const el2 =msg.querySelector('.sigma-btn-pause')
        if(el2) (el2 as HTMLElement).style.display = 'none';
      })

      /** On audio position change, fires continuously during playback */
      wavesurfer.on('timeupdate', (currentTime) => {
        var msg = document.getElementById(`sigma-message-${id}`);
        if(!msg){ return; }
        let totalSeconds = currentTime; // replace with your time in seconds
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const el = msg.querySelector('.sigma-time-audio');
        if(el) (el as HTMLElement).innerText = formattedTime;
      })

      this.clearAudio();
    } else {
      this.clearFile();
    }
  }

  async delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  finish(): void {
    console.log('finish', this.playing);
    this.playing = false;
    this.cd.detectChanges();
    console.log('finish', this.playing);
  }

  playPauseAudio(id: string): void {
    if(this.audios.get(id) === undefined){
      return;
    }
    if(this.currentAudio && (this.currentAudio != id) && this.audios.get(this.currentAudio) && this.audios.get(this.currentAudio).isPlaying()){
      this.audios.get(this.currentAudio).pause();
    }
    this.currentAudio = id;
    this.audios.get(id).playPause();
  }

  filename(message: ChatMessage): string {
    return message.attachment?.split('/').pop() || "file";
  }

  playPause(): void {
    this.wavesurfer.playPause();
    this.playing = !this.playing;
  }

  clearAudio(): void {
    this.wavesurfer.destroy();
    this.recorded = false;
    this.file = null;
  }

  stopRecording(): void {
    this.recording = false;
    this.recorded = true;
    this.record.stopRecording();
  }

  formatDate(date: string): string {
    return moment(date).format(this.config.dateFormat);
  }

  onFileInput(event): void {
    this.file = event.target.files[0];
    event.target.value = '';
    this.message = this.file?.name ?? "file";
  }

  clearFile(): void {
    this.file = null;
    this.message = '';
  }

	scrollToBottom(): void {
		setTimeout(() => {
			try {
				this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
			} catch (err) {}
		}, 20);
	}

	close() {
		this.panelService.togglePanel(PanelType.CHAT);
	}

	private subscribeToMessages() {
		this.chatMessageSubscription = this.chatService.messagesObs.subscribe((messages: ChatMessage[]) => {
			this.messageList = messages;//[{system: true, message: 'Welcome to the chat!', name: 'Dialogi', type: 'text', datetime: new Date().toISOString()}];
			if (this.panelService.isChatPanelOpened()) {
				this.scrollToBottom();
				this.cd.markForCheck();
			}
		});
	}
}

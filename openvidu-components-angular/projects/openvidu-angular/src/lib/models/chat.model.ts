/**
 * @internal
 */
export interface ChatMessage {
  id: string;
	system: boolean;
	name: string;
	message?: string;
  attachment?: string;
  type: string;
  datetime: string;
  status?: string;
}

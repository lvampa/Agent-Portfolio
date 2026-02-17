import { EVENTS } from "../constants/events"

export interface EventBusSubmitEvent {
  type: typeof EVENTS.SUBMIT;
  message: string;
}
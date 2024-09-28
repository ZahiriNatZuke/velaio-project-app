export interface ConfirmationData {
  action: ConfirmationAction;
  name: string;
}

export enum ConfirmationAction {
  Complete = 'mark-as-complete',
  Remove = 'remove',
}

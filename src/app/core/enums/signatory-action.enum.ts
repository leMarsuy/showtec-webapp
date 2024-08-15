export enum SignatoryAction {
  REQUESTED = 'Requested',
  PREPARED = 'Prepared',
  CHECKED = 'Checked',
  APPROVED = 'Approved',
}

export const SIGNATORY_ACTIONS = Object.values(SignatoryAction);

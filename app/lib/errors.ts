export class CalendarError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "CalendarError";
  }
}

export const CalendarErrorCodes = {
  FETCH_FAILED: "FETCH_FAILED",
  INVALID_DATE: "INVALID_DATE",
  EVENT_NOT_FOUND: "EVENT_NOT_FOUND",
  OPERATION_FAILED: "OPERATION_FAILED",
} as const;

export type CalendarErrorCode = keyof typeof CalendarErrorCodes;

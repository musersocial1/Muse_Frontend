export const STEPS = {
  PHONE: "phone",
  VERIFY_OTP: "verify_otp",
  PASSWORD: "password",
  PERSONAL_INFO: "personal_info",
} as const;

export type StepType = (typeof STEPS)[keyof typeof STEPS];

/** Session draft between signup form and OTP page (password never in URL). */
export const SIGNUP_OTP_DRAFT_KEY = 'rloco_signup_otp_draft';

export interface SignupOtpDraft {
  phone: string;
  email: string;
  name: string;
  password: string;
}

/** Backup when React Router `location.state` is lost (refresh, new tab) between /login and /otp-verification. */
export const LOGIN_OTP_SESSION_KEY = 'rloco_login_otp_session';

export interface LoginOtpSession {
  phone: string;
  returnTo: string;
  isSignup: boolean;
}

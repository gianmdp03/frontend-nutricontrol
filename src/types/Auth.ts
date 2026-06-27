export interface ForgotPasswordState {
  email: string;
  token: string;
  step: 1 | 2 | 3;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: Record<string, string> | string | null | unknown;
}

export interface ActionResponseWithData<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: Record<string, string> | string | null | unknown;
}

export interface ForgotPasswordWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export interface ForgotEmailWizardProps {
  onClose: () => void;
  onForgotPassword: () => void;
}


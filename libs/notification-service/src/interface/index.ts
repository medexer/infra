export interface EmailRequest {
  sender: {
    name: string;
    email: string;
  };
  to: {
    email: string;
  }[];
  subject: string;
  htmlContent: string;
  attachment?: { url?: string; content: string; name: string }[];
}

import { UserDocument } from '../schemas';

export interface LogInResponse {
  user: UserDocument;
  token: string;
}

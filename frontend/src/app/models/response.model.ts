import { IArticle } from './article.model';

export interface IResponse {
  status: number;
  code: number;
  message: string;
  data?: IArticle | { token: string } | { name: string } | null;
}

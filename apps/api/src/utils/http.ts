import { classToPlain } from 'class-transformer';

export class ResponsePayload<T, M = any> {
  data: object | undefined;
  meta: any;
}

export const response = <T, M>(data: T, meta?: M): ResponsePayload<T> => {
  return {
    data: classToPlain(data),
    meta: meta && classToPlain(meta),
  };
};

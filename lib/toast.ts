import { toast } from 'react-toastify';

export class ErrorService {
  static async envelop(
    action: () => Promise<any>,
    error?: (err: any) => Promise<any>,
  ) {
    try {
      await action();
    } catch (err) {
      toast(err.message, { type: 'error' });
      if (error) await error(err).catch(() => null);
    }
  }

  static validate(res: Response) {
    if (res.ok) return;
    throw new Error(
      // `HTTP  status code: ${res.status}; '${res.url.replace(API_URL, '')}'`,
      `HTTP  status code: ${res.status}; '${res.url.replace('', '')}'`,
    );
  }
}

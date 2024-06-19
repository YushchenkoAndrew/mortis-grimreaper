import { toast, UpdateOptions } from 'react-toastify';

type OptionsT = Partial<{
  in_progress: boolean;
  error: (err: any) => Promise<any>;
}>;

export class ErrorService {
  static async envelop(
    action: () => Promise<any>,
    { in_progress, error }: OptionsT = {},
  ) {
    const id = in_progress && toast.loading('Request in progress...');
    const options = { autoClose: 5000, isLoading: false, type: 'error' } as UpdateOptions; // prettier-ignore

    try {
      await action();

      if (id) toast.update(id, { ...options, render: "Request was successful", type: 'success' }); // prettier-ignore
    } catch (err) {
      if (id) toast.update(id, { ...options, render: err.message });
      else toast(err.message, options);

      if (error) await error(err).catch(() => null);
    }
  }
}

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorService } from '../../lib';

export const preloadSidebar = createAsyncThunk('sidebar/preload', async () => {
  return {
    alias: await fetch(`${''}/alias?order_by=updated_at`).then(
      (res) => (ErrorService.validate(res), res.json()),
    ),
    // .then((res) => new AliasPageEntity().build(res)),
  };
});

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminAttachmentEntity } from '../entities/admin-attachment.entity';

export type AdminAttachmentStoreT = AdminAttachmentEntity & {
  buffer: string;
};

export const AdminAttachmentStore = createSlice({
  name: 'admin-attachment',
  initialState: {
    name: '',
    path: '',

    buffer: null,
  } as AdminAttachmentStoreT,
  reducers: {
    init: (state, action: PayloadAction<AdminAttachmentEntity>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.type = action.payload.type;
      state.path = action.payload.path;
      state.preview = action.payload.preview;

      state.updated_at = action.payload.updated_at;
    },
    reset: (state) => {
      state.id = null;
    },
    setBuffer: (state, action: PayloadAction<string>) => {
      state.buffer = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      const filepath = action.payload || '';
      const path = filepath.split('/');

      if (path.length > 1) {
        state.path = [state.path].concat(path.slice(0, -1)).join('/');
        state.name = path.at(-1);
      } else state.name = path[0];
    },
    popPath(state) {
      if (state.path == '') return;

      const path = state.path.split('/');
      state.path = path.slice(0, -1).join('/');
      state.name = path.at(-1) + state.name;
    },
    setAttachableId: (state, action: PayloadAction<string>) => {
      state.attachable_id = action.payload || '';
    },
  },
});

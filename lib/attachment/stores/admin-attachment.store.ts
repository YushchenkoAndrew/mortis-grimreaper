import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminAttachmentEntity } from '../entities/admin-attachment.entity';

type AdminAttachmentStoreT = Pick<
  AdminAttachmentEntity,
  'id' | 'name' | 'type' | 'path'
> & {
  buffer: string;
};

export const AdminAttachmentStore = createSlice({
  name: 'admin-attachment',
  initialState: {
    name: '',

    buffer: null,
  } as AdminAttachmentStoreT,
  reducers: {
    setBuffer: (state, action: PayloadAction<string>) => {
      state.buffer = action.payload;
    },

    setAttachment: (state, action: PayloadAction<AdminAttachmentEntity>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.type = action.payload.type;
      state.path = action.payload.path;

      console.log({ payload: action.payload, state });
      // console.log(modelist.getModeForPath(state.name));
    },
  },
});

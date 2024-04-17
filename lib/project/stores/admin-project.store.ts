import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminAttachmentEntity } from '../../attachment/entities/admin-attachment.entity';
import { ObjectLiteral } from '../../common/types';
import { AdminProjectEntity } from '../entities/admin-project.entity';
import { ProjectTypeEnum } from '../types/project-type.enum';

type StoreT = AdminProjectEntity & {
  avatar: string;
  readme: string;
  trash: ObjectLiteral<AdminAttachmentEntity>;
};

export const AdminProjectStore = createSlice({
  name: 'admin-project',
  initialState: {
    name: '',
    attachments: [],

    trash: null,
    readme: '',
  } as StoreT,
  reducers: {
    setType: (state, action: PayloadAction<ProjectTypeEnum>) => {
      state.type = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload || '';
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload || '';
    },
    setFooter: (state, action: PayloadAction<string>) => {
      state.footer = action.payload || '';
    },
    setREADME: (state, action: PayloadAction<string>) => {
      state.readme = action.payload || '';
    },
    initTrash: (state) => {
      state.trash = {};
    },
    pushTrash: (state, action: PayloadAction<AdminAttachmentEntity>) => {
      const id = action.payload.id;

      if (state.trash[id]) delete state.trash[id];
      else state.trash[id] = action.payload;
    },
    clearTrash: (state) => {
      state.trash = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      AdminProjectEntity.self.load.thunk.fulfilled,
      (state, { payload }) => {
        const res: AdminProjectEntity = payload as any;

        state.id = res.id;
        state.name = res.name;
        state.type = res.type;
        state.description = res.description;
        state.footer = res.footer;

        state.attachments = res.attachments;
        state.avatar = res._avatar();
      },
    );
  },
});

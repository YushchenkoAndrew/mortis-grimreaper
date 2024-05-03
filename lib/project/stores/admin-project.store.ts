import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminAttachmentEntity } from '../../attachment/entities/admin-attachment.entity';
import { ObjectLiteral } from '../../common/types';
import { AdminProjectEntity } from '../entities/admin-project.entity';
import { ProjectTypeEnum } from '../types/project-type.enum';

type StoreT = Omit<AdminProjectEntity, 'readme'> & {
  avatar: string;
  html: string;
  directory: string;
  trash: ObjectLiteral<AdminAttachmentEntity>;
  picked: AdminAttachmentEntity;
};

export const AdminProjectStore = createSlice({
  name: 'admin-project',
  initialState: {
    name: '',
    status: '' as any,

    links: [],
    attachments: [],

    trash: null,
    picked: null,
    html: '',
    directory: null,
  } as StoreT,
  reducers: {
    init: (state) => {
      state.name = '';
      state.status = '' as any;

      state.links = [];
      state.attachments = [];

      state.avatar = null;
      state.trash = null;
      state.picked = null;
      state.html = '';
      state.directory = null;
    },
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
    setHtml: (state, action: PayloadAction<string>) => {
      state.html = action.payload || '';
    },
    replaceAttachment: (
      state,
      action: PayloadAction<AdminAttachmentEntity>,
    ) => {
      const index = state.attachments.findIndex((e) => e.id == action.payload.id); // prettier-ignore
      if (index == -1) return;

      state.attachments[index] = action.payload;
    },
    initDir: (state) => {
      state.directory = '';
    },
    setDir: (state, action: PayloadAction<string>) => {
      state.directory = action.payload || '';
    },
    clearDir: (state) => {
      state.directory = null;
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
    onPick: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.picked = state.attachments.find((e) => e.id == id) || null;
    },
    onReorder: (state, action: PayloadAction<AdminAttachmentEntity[]>) => {
      state.attachments = action.payload.map(
        (e, index) => ((e.order = index), e),
      );
    },
    onDrop: (state) => {
      state.picked = null;
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
        state.status = res.status;
        state.description = res.description;
        state.footer = res.footer;

        state.attachments = res.attachments;
        state.avatar = res._avatar();

        state.trash = null;
        state.picked = null;
        state.html = '';
        state.directory = null;
      },
    );
  },
});

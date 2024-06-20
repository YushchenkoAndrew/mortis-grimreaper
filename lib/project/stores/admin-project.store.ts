import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { AdminAttachmentEntity } from '../../attachment/entities/admin-attachment.entity';
import { ObjectLiteral } from '../../common/types';
import { AdminProjectEntity } from '../entities/admin-project.entity';
import { ProjectStatusEnum } from '../types/project-status.enum';
import { ProjectTypeEnum } from '../types/project-type.enum';

type StoreT = Omit<AdminProjectEntity, 'readme'> & {
  avatar: string;
  html: string;
  trash: ObjectLiteral<AdminAttachmentEntity>;
  picked: AdminAttachmentEntity;
};

export const AdminProjectStore = createSlice({
  name: 'admin-project',
  initialState: {
    name: '',
    status: '' as any,

    tags: [],
    links: [],
    attachments: [],

    trash: null,
    picked: null,
    html: '',
  } as StoreT,
  reducers: {
    init: (state, { payload }) => {
      const res: AdminProjectEntity = payload as any;

      state.id = res.id;
      state.name = res.name;
      state.type = res.type;
      state.status = res.status;
      state.footer = res.footer;
      state.description = res.description;

      state.tags = res.tags;
      state.links = res.links;
      state.attachments = res.attachments;
      state.avatar = res._avatar(uuid());

      state.trash = null;
      state.picked = null;
      state.html = '';
    },
    setType: (state, action: PayloadAction<ProjectTypeEnum>) => {
      state.type = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload || '';
    },
    setStatus: (state, action: PayloadAction<ProjectStatusEnum>) => {
      state.status = action.payload || null;
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
    initTrash: (state) => {
      state.trash = {};
    },
    pushTrash: (
      state,
      action: PayloadAction<AdminAttachmentEntity | AdminAttachmentEntity[]>,
    ) => {
      const attachments = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      for (const attachment of attachments) {
        const id = attachment.id;

        if (state.trash[id]) delete state.trash[id];
        else state.trash[id] = attachment;
      }
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
        (e, index) => ((e.order = index + 1), e),
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

        state.name = res.name;
        state.status = res.status;

        state.footer = res.footer;
        state.description = res.description;

        state.tags = res.tags;
        state.links = res.links;
        state.attachments = res.attachments;
        state.avatar = res._avatar(uuid());

        state.trash = null;
      },
    );
  },
});

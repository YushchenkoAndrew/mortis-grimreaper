import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminAttachmentEntity } from '../../attachment/entities/admin-attachment.entity';
import { ObjectLiteral } from '../../common/types';
import { AdminContextFieldEntity } from '../../context/entities/admin-context-field.entity';
import { ContextFieldValueEnum } from '../../context/types/context-field-value.enum';
import { AdminLinkEntity } from '../../link/entities/admin-link.entity';
import { LinkLinkableTypeEnum } from '../../link/types/link-linkable-type.enum';
import { AdminTagEntity } from '../../tag/entities/admin-tag.entity';
import { TagTaggableTypeEnum } from '../../tag/types/tag-taggable-type.enum';
import { AdminTaskEntity } from '../entities/admin-task.entity';
import { TaskStatusEnum } from '../types/task-status.enum';

type StoreT = AdminTaskEntity & {
  stage_id: string;
  // dashboard: ObjectLiteral<AdminStageEntity>;

  tag: AdminTagEntity;
  picked: AdminAttachmentEntity;
};

export const AdminTaskFormStore = createSlice({
  name: 'admin-task-form',
  initialState: {
    stage_id: '',

    tag: null,
    picked: null,
    // dashboard: {},
    // stages: [],
    // trash: null,
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<[string, AdminTaskEntity]>) => {
      const [stage_id, res]: [string, AdminTaskEntity] = action.payload as any;
      state.stage_id = stage_id;

      state.id = res.id;
      state.name = res.name || '';
      state.description = res.description || '';
      state.status = res.status || TaskStatusEnum.active;

      state.tags = res.tags;
      state.owner = res.owner;
      state.attachments = res.attachments;
      state.contexts = res.contexts;

      state.tag = null;
      state.links = res.links.concat(
        res.id == 'null' ? new AdminLinkEntity({ name: '', link: '' }) : null,
      );
    },
    reset: (state) => {
      state.id = null;
      // state.name = '';
      // state.description = '';
      // state.status = TaskStatusEnum.active;

      // state.tags = [];
      // state.links = [];
    },
    setId: (state, action: PayloadAction<[string, string]>) => {
      [state.stage_id, state.id] = action.payload || [];
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload || '';
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload || '';
    },
    setTag: (state, action: PayloadAction<string>) => {
      state.tag = new AdminTagEntity({
        name: action.payload || '',
        taggable_id: state.id,
        taggable_type: TagTaggableTypeEnum.tasks,
      });
    },
    addTag: (state) => {
      if (!state.tag?.name) return;

      state.tags.push(state.tag);
      state.tag = null;
    },
    delTag: (state, action: PayloadAction<number>) => {
      const tag = state.tags[action.payload];
      if (!tag) return;

      state.tags.splice(action.payload, 1);
    },
    setLinks: (state, action: PayloadAction<[string, string, number]>) => {
      const [key, value, index] = action.payload;
      if (!state.links[index]) return;

      state.links[index] = new AdminLinkEntity({
        ...(state.links[index] as any),
        name: key,
        link: value,
        linkable_id: state.id,
        linkable_type: LinkLinkableTypeEnum.tasks,
      });
    },
    newLink: (state) => {
      const index = state.links.length - 1;
      const instance = new AdminLinkEntity({
        name: '',
        link: '',
        linkable_id: state.id,
        linkable_type: LinkLinkableTypeEnum.tasks,
      });

      if (index >= 0) return void (state.links[index] = instance); // prettier-ignore
      state.links.push(instance);
    },
    addLink: (state) => {
      if (!state.links.at(-1)?.link) return;

      const index = state.links.length - 1;
      state.links[index] = new AdminLinkEntity({
        ...state.links[index],
        name: state.links[index].name || state.links[index].link,
      } as any);

      state.links.push({ name: '', link: '' } as any);
    },
    delLink: (state, action: PayloadAction<number>) => {
      const link = state.links[action.payload];
      if (!link) return;

      state.links.splice(action.payload, 1);
    },
    onLinkReorder: (state, action: PayloadAction<AdminLinkEntity[]>) => {
      state.links = action.payload;
    },
    setField: (state, action: PayloadAction<[string, number]>) => {
      const [key, index] = action.payload;
      if (!state.contexts?.[0]?.fields[index]) return;

      state.contexts[0].fields[index] = new AdminContextFieldEntity({
        ...(state.contexts[0].fields[index] as any),
        name: key,
      });
    },
    newField: (state) => {
      if (!state.contexts?.[0]?.fields) return;

      const index = state.contexts[0].fields.length - 1;
      const instance = new AdminContextFieldEntity({
        name: '',
        value: 'false',
        options: { type: ContextFieldValueEnum.boolean },
      });

      if (index >= 0) return void (state.contexts[0].fields[index] = instance); // prettier-ignore
      state.contexts[0].fields.push(instance);
    },
    onFieldReorder: (
      state,
      action: PayloadAction<AdminContextFieldEntity[]>,
    ) => {
      if (!state.contexts?.[0]?.fields) return;
      state.contexts[0].fields = action.payload;
    },
    onAttachmentPick: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.picked = state.attachments.find((e) => e.id == id) || null;
    },
    onAttachmentReorder: (
      state,
      action: PayloadAction<AdminAttachmentEntity[]>,
    ) => {
      state.attachments = action.payload;
    },
    onAttachmentDrop: (state) => {
      state.picked = null;
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(
  //     AdminDashboardCollection.self.select.thunk.fulfilled,
  //     (state, { payload }) => {
  //       const res: AdminDashboardCollection = payload as any;
  //       state.stages = res.stages;
  //     },
  //   );
  // },
});

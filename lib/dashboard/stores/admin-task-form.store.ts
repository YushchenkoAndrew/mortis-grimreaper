import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminAttachmentEntity } from '../../attachment/entities/admin-attachment.entity';
import { AdminLinkEntity } from '../../link/entities/admin-link.entity';
import { LinkLinkableTypeEnum } from '../../link/types/link-linkable-type.enum';
import { AdminTagEntity } from '../../tag/entities/admin-tag.entity';
import { TagTaggableTypeEnum } from '../../tag/types/tag-taggable-type.enum';
import { AdminTaskEntity } from '../entities/admin-task.entity';
import { TaskStatusEnum } from '../types/task-status.enum';

type StoreT = AdminTaskEntity & {
  stage_id: string;
  // trash: ObjectLiteral<AdminProjectEntity>;
  // dashboard: ObjectLiteral<AdminStageEntity>;

  tag: string;
  picked: AdminAttachmentEntity;
};

export const AdminTaskFormStore = createSlice({
  name: 'admin-task-form',
  initialState: {
    stage_id: '',

    tag: '',
    picked: null,
    // dashboard: {},
    // stages: [],
    // trash: null,
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<[string, AdminTaskEntity]>) => {
      const [stage_id, res]: [string, AdminTaskEntity] = action.payload as any;
      state.stage_id = stage_id;

      console.log(res.owner);

      state.id = res.id;
      state.name = res.name || '';
      state.status = res.status || TaskStatusEnum.active;

      state.tags = res.tags;
      state.owner = res.owner;
      state.attachments = res.attachments;

      state.tag = '';
      state.links = res.links.concat(
        res.id == 'null' ? new AdminLinkEntity({ name: '', link: '' }) : null,
      );
    },
    reset: (state) => {
      state.id = null;
      state.name = '';
      state.status = TaskStatusEnum.active;

      state.tags = [];
      state.links = [];
    },
    setId: (state, action: PayloadAction<[string, string]>) => {
      [state.stage_id, state.id] = action.payload || [];
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = (action.payload || '').toUpperCase();
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload || '';
    },
    setTag: (state, action: PayloadAction<string>) => {
      state.tag = action.payload || '';
    },
    addTag: (state) => {
      if (!state.tag) return;

      state.tags.push(
        new AdminTagEntity({
          name: state.tag,
          taggable_id: state.id,
          taggable_type: TagTaggableTypeEnum.tasks,
        }),
      );

      state.tag = '';
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
      if (index >= 0) return void (state.links[index] = new AdminLinkEntity({ name: '', link: '' })); // prettier-ignore

      state.links.push(
        new AdminLinkEntity({
          name: '',
          link: '',
          linkable_id: state.id,
          linkable_type: LinkLinkableTypeEnum.tasks,
        }),
      );
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

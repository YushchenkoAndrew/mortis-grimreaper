import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  del_tags: AdminTagEntity[];

  new_links: AdminLinkEntity[];
  del_links: AdminLinkEntity[];
};

export const AdminTaskFormStore = createSlice({
  name: 'admin-task-form',
  initialState: {
    stage_id: '',

    tag: '',
    new_links: [],
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
      state.status = res.status || TaskStatusEnum.active;

      state.tags = res.tags;
      state.links = res.links;
      state.attachments = res.attachments;

      state.tag = '';
      state.new_links = res.links.concat({ name: '', link: '' } as any);
    },
    reset: (state) => {
      state.id = null;
      state.name = '';
      state.status = TaskStatusEnum.active;
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
      if (!state.new_links[index]) return;

      state.new_links[index] = new AdminLinkEntity({
        ...(state.new_links[index] as any),
        name: key,
        link: value,
        linkable_id: state.id,
        linkable_type: LinkLinkableTypeEnum.tasks,
      });
    },
    addLink: (state) => {
      if (!state.new_links.at(-1).link) return;

      const index = state.new_links.length - 1;
      state.new_links[index] = new AdminLinkEntity({
        ...state.new_links[index],
        name: state.new_links[index].name || state.new_links[index].link,
      } as any);

      state.new_links.push({ name: '', link: '' } as any);
    },
    delLink: (state, action: PayloadAction<number>) => {
      const link = state.new_links[action.payload];
      if (!link) return;

      state.new_links.splice(action.payload, 1);
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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginEntity } from '../../../entities/auth/login.entity';

type LoginStoreT = Pick<LoginEntity, 'username' | 'password'>;

export const loginStore = createSlice({
  name: 'login',
  initialState: { username: '', password: '' } as LoginStoreT,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload || '';
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload || '';
    },
  },
  extraReducers(builder) {
    builder.addCase(LoginEntity.self.save.fulfilled, (state, { payload }) => {
      // const res: SettingEntity = payload as any;
      // state.loaded = true;

      console.log(payload);

      // state.res = res;
      // state.mode = State2Mode(res.mode);
    });
  },
});

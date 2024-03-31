import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthEntity } from '../../../entities/auth/auth.entity';
import { LoginEntity } from '../../../entities/auth/login.entity';
import { RecaptchaSizeEnum } from '../../../types/recaptcha-size.enum';

type LoginStoreT = Pick<LoginEntity, 'username' | 'password'> & {
  recaptcha: number;
};

export const loginStore = createSlice({
  name: 'login',
  initialState: {
    username: '',
    password: '',
    recaptcha: RecaptchaSizeEnum.invisible,
  } as LoginStoreT,
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
      const res: AuthEntity = payload as any;

      localStorage.setItem('refresh_token', res.refresh_token);
      localStorage.setItem('access_token', res.access_token);
    });
  },
});

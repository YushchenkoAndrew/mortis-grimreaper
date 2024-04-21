import nextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Config } from '../../../../config';
import { AuthEntity } from '../../../../lib/auth/entities/auth.entity';
import { LoginEntity } from '../../../../lib/auth/entities/login.entity';
import { AdminPingEntity } from '../../../../lib/auth/entities/ping.entity';
import { RefreshEntity } from '../../../../lib/auth/entities/refresh.entity';

export const options: AuthOptions = {
  secret: Config.self.base.secret,
  pages: {
    signIn: `${Config.self.base.web}/admin/login`,
  },

  callbacks: {
    async jwt(options) {
      const token = options.token;
      const auth: AuthEntity = options.user as any;

      if (auth) {
        token.user = auth.user;
        token.access_token = auth.access_token;
        token.refresh_token = auth.refresh_token;
      }

      const ping = await AdminPingEntity.self.select
        .build(
          {},
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
            pathname: `${Config.self.base.grape}/auth/ping`,
          },
        )
        .catch(() => null);

      if (ping) return token;
      const refreshed = (await AuthEntity.self.save
        .build(
          new RefreshEntity({ refresh_token: token.refresh_token as any }),
          { pathname: `${Config.self.base.grape}/auth/refresh` },
        )
        .catch((err) => (console.log(err), null))) as AuthEntity;

      if (!refreshed) return null;
      token.user = refreshed.user;
      token.access_token = refreshed.access_token;
      token.refresh_token = refreshed.refresh_token;

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: token.user,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      };
    },
  },

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        return AuthEntity.self.save
          .build(new LoginEntity(credentials), {
            pathname: `${Config.self.base.grape}/auth/login`,
          })
          .catch(() => null);
      },
    }),
  ],
};

export default nextAuth(options);

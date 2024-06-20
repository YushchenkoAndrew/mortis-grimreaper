import { useMemo, useRef } from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import { Config } from '../../config';
import { LoginStore } from '../../lib/auth/stores/login.store';
import { useAppDispatch, useAppSelector } from '../../lib/common/store';
import ReCAPTCHA from 'react-google-recaptcha';
import { ErrorService } from '../../lib/common/error.service';
import { CaptchaEntity } from '../../lib/captcha/entities/captcha.entity';
import InputFormElement from '../../components/Form/Elements/InputFormElement';
import { RecaptchaSizeEnum } from '../../lib/captcha/types/recaptcha-size.enum';
import { signIn } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../api/admin/auth/[...nextauth]';
import { useRouter } from 'next/router';
import { LoginEntity } from '../../lib/auth/entities/login.entity';
import { useValidate } from '../../hooks/useValidate';

export default function () {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.login);
  const errors = useValidate(LoginEntity, form);

  const router = useRouter();
  const reCaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <>
      <Header title="Login" />

      <Container>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-lg">
            <div className="flex-shrink-0">
              <img
                className="mx-auto h-20 w-auto rounded-full"
                src={Config.self.github.src}
                alt="Admin"
              />
            </div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
            <InputFormElement
              name="Username"
              autoComplete="username"
              value={form.username}
              onChange={(e) => dispatch(LoginStore.actions.setUsername(e))}
              errors={errors?.username}
              required
            />
            <InputFormElement
              name="Password"
              autoComplete="current-password"
              type="password"
              value={form.password}
              onChange={(e) => dispatch(LoginStore.actions.setPassword(e))}
              errors={errors?.password}
              required
            />

            <ReCAPTCHA
              ref={reCaptchaRef}
              size={RecaptchaSizeEnum[form.recaptcha]}
              sitekey={Config.self.captcha.sitekey}
            />

            <div>
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                type="button"
                onClick={() =>
                  ErrorService.envelop(
                    async () => {
                      if (errors) return;

                      const captcha =
                        form.recaptcha == RecaptchaSizeEnum.invisible
                          ? await reCaptchaRef.current?.executeAsync()
                          : reCaptchaRef.current?.getValue();

                      // prettier-ignore
                      if (!captcha) throw new Error('Please verify that you are not a robot');

                      // prettier-ignore
                      await dispatch(CaptchaEntity.self.save.thunk(new CaptchaEntity({ captcha }))).unwrap();
                      await signIn('credentials', { ...form, redirect: false }); // prettier-ignore

                      router.push('/admin/projects');
                    },
                    {
                      in_progress: true,
                      error: async () => reCaptchaRef.current?.reset(),
                    },
                  )
                }
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  if (session) return { redirect: { destination: '/admin/projects' } };

  return { props: {} };
}

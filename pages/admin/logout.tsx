import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ErrorService } from '../../lib/common/error.service';

export default function () {
  const router = useRouter();

  useEffect(() => {
    ErrorService.envelop(async () => {
      await signOut({ redirect: false });
      router.push('/projects');
    });
  }, []);

  return <></>;
}

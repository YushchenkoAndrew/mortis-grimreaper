import { useMemo } from 'react';
import { CommonEntity } from '../lib/common/entities/common.entity';
import { ZodErrorT } from '../lib/common/types';

export declare type ObjectType<T> = { new (): T };

export function useValidate<T extends CommonEntity, V>(
  entity: ObjectType<T>,
  form: V,
) {
  const schema = useMemo(() => new entity().zod(), []);

  const errors = useMemo(() => {
    const result = schema.safeParse(form);
    if (result.success) return null;
    return result.error.flatten().fieldErrors as ZodErrorT<T>;
  }, [form]);

  return errors;
}

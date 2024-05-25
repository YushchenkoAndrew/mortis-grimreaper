import { KeyboardEvent, useCallback } from 'react';
import { ErrorService } from '../../../../lib/common/error.service';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { AdminDashboardCollection } from '../../../../lib/dashboard/collections/admin-dashboard.collection';
import { AdminStageEntity } from '../../../../lib/dashboard/entities/admin-stage.entity';
import { AdminStageFormStore } from '../../../../lib/dashboard/stores/admin-stage-form.store';
import InputFormElement from '../../Elements/InputFormElement';
import NextFormElement from '../../Elements/NextFormElement';

export interface StageFormPageCreateProps {
  className?: string;
}

export default function StageFormCreatePage(props: StageFormPageCreateProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.dashboard.stage.form);

  const onSubmit = useCallback(() => {
    ErrorService.envelop(async () => {
      const copy = { ...form, id: null };
      await dispatch(AdminStageEntity.self.save.thunk(copy)).unwrap(); // prettier-ignore
      dispatch(AdminStageFormStore.actions.reset());

      await dispatch(AdminDashboardCollection.self.select.thunk({})); // prettier-ignore
    });
  }, [form]);

  const onKeyDown = (e: KeyboardEvent<any>) => e.key == 'Enter' && onSubmit();

  return (
    <>
      <div className="mt-8 mx-5 space-y-7">
        <InputFormElement
          name="Stage Name"
          placeholder="Stage Name"
          value={form.name}
          onChange={(e) => dispatch(AdminStageFormStore.actions.setName(e))}
          onKeyDown={onKeyDown}
          required
        />
      </div>

      <div className="flex w-full my-4">
        <NextFormElement
          className="ml-auto mr-4"
          next="Create Stage"
          back="Cancel"
          onNext={() => onSubmit()}
          onBack={() => dispatch(AdminStageFormStore.actions.reset())}
          setOptions={{
            buttonPadding: 'py-1.5 px-4',
            nextButtonColor: 'text-white bg-green-600 hover:bg-green-700',
          }}
        />
      </div>
    </>
  );
}

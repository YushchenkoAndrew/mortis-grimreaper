import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import { Dispatch, Fragment, ReactNode } from 'react';
import { ObjectLiteral } from '../../../lib/common/types';

export interface PopupFormElementProps {
  open: boolean;
  className?: string;
  onClose: Dispatch<boolean>;
  children: ReactNode;
  setOptions?: Partial<{ panelSize: string }>;
}

export default function PopupFormElement(props: PopupFormElementProps) {
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className={`relative z-10 ${props.className ?? ''}`}
        onClose={props.onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative transform overflow-hidden rounded-md bg-white dark:bg-gray-800 text-left shadow-xl transition-all border border-gray-300 dark:border-gray-700 sm:my-8 ${
                  props.setOptions?.panelSize || 'sm:w-full sm:max-w-lg'
                }`}
              >
                {props.children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure, Transition } from '@headlessui/react';
import { ReactNode } from 'react';

export interface DisclosureFormElementProps {
  name: string;
  description?: string;
  children: ReactNode;
}

export default function DisclosureFormElement(
  props: DisclosureFormElementProps,
) {
  return (
    <div className="flex flex-col py-2 px-4 w-full rounded border border-gray-300">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="group flex flex-col  leading-6  text-gray-800 items-start">
              <div className="flex w-full text-sm font-medium">
                <FontAwesomeIcon
                  className={`mr-2 pt-1 transition-all transform ${
                    open ? 'rotate-90' : ''
                  }`}
                  icon={faChevronRight}
                />
                <span className="group-hover:underline">{props.name}</span>
              </div>
              <label
                className={`${
                  props.description ? 'block' : 'hidden'
                } text-sm ml-4 text-gray-500`}
              >
                {props.description}
              </label>
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel static>
                <div className="mb-2">{props.children}</div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
}

import { ComponentType, memo } from 'react';
import { Disclosure } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import { NavbarItemProps } from './NavbarItem';
import Avatar, { AvatarProps } from './Avatar';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

export interface NavbarProps {
  Item: ComponentType<NavbarItemProps>;

  pathname?: string;
  navigation: { name: string; href: string }[];
  avatar?: AvatarProps;
}

export default function Navbar({ Item, ...props }: NavbarProps) {
  const pathname = usePathname();
  return (
    <Disclosure as="nav" className="bg-gray-900">
      {({ open }) => (
        <>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="hidden md:block">
                  <div className="flex items-baseline space-x-4">
                    {props.navigation.map((item, index) => (
                      <Item
                        key={index}
                        href={item.href}
                        name={item.name}
                        active={(props.pathname ?? pathname) == item.href}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:flex relative max-w-xs items-center rounded-full bg-gray-900 text-sm outline-none ring-1 ring-gray-600 ring-offset-2 ring-offset-gray-800">
                {props.avatar && <Avatar {...props.avatar} />}
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 ring-1 ring-gray-700">
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    className="block h-6 w-6"
                  />
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {props.navigation.map((item, index) => (
                <Disclosure.Button
                  key={index}
                  as={Item}
                  href={item.href}
                  name={item.name}
                  active={(props.pathname ?? pathname) == item.href}
                  className="hover:bg-gray-700 hover:text-white rounded-md"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              {props.avatar && <Avatar {...props.avatar} />}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

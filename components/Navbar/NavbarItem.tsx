import Link from 'next/link';

export interface NavbarItemProps {
  name: string;
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  active?: boolean;

  className?: string;
}

export default function NavbarItem(props: NavbarItemProps) {
  return (
    <Link
      href={props.href}
      className={`${
        props.active
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } rounded-md px-3 py-2 text-sm font-medium`}
      target={props.target ?? '_self'}
    >
      {props.name}
    </Link>
  );
}

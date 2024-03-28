export interface NavbarItemProps {
  name: string;
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  active?: boolean;

  className?: string;
}

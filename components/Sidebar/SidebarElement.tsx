export interface SidebarElementProps {
  className?: string;
  value: string;

  tree?: boolean;
  open?: boolean;
}

export default function SidebarElement(props: SidebarElementProps) {
  return (
    <div className={`${props.className || ''} flex items-center w-full ml-1`}>
      <span className="text-gray-800">{props.value}</span>
    </div>
  );
}

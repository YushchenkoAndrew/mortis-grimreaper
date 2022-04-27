export interface SideBarChapterProps {
  name: string;
  children?: React.ReactNode;
}

export default function SideBarChapter(props: SideBarChapterProps) {
  return (
    <>
      <hr className="my-2" />
      <li className="border-top px-3">
        <p className="mt-3 mb-1 font-weight-bold text-dark">{props.name}</p>
      </li>

      <li className="pl-2 nav-pills flex-column">{props.children}</li>
    </>
  );
}

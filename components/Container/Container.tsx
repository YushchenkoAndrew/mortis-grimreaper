export interface ContainerProps {
  Navbar?: React.ReactNode;
  Actions?: React.ReactNode;

  children?: React.ReactNode;
  className?: string;
}

export default function Container(props: ContainerProps) {
  return (
    <div className={`${props.className ?? ''} min-h-full`}>
      {props.Navbar}

      <header
        className={`${
          props.Actions ? 'block' : 'hidden'
        } bg-transparent shadow`}
      >
        <div className="ml-2 max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {props.Actions}
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:max-w-4xl lg:max-w-7xl lg:px-8">
          {props.children}
        </div>
      </main>
    </div>
  );
}

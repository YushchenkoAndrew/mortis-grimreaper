import { ReactNode } from 'react';

export interface ContainerProps {
  Navbar?: ReactNode;
  Sidebar?: ReactNode;
  Breadcrumbs?: ReactNode;

  children?: ReactNode;
  className?: string;
}

export default function Container(props: ContainerProps) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {props.Navbar}

      <div className="flex">
        {props.Sidebar}
        <main className="w-full">
          <div
            className={
              props.className ||
              'mx-auto max-w-4xl px-4 py-6 sm:px-6 md:max-w-4xl lg:max-w-7xl lg:px-8'
            }
          >
            {props.Breadcrumbs ? (
              // <header className="bg-transparent shadow py-4">
              <header className="bg-transparent py-4">
                {props.Breadcrumbs}
              </header>
            ) : (
              <></>
            )}

            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}

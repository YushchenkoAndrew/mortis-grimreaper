import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import { CSSProperties, Dispatch, forwardRef, ReactNode } from 'react';
import ImgFormElement from '../Elements/ImgFormElement';
import TooltipFormPreview from './TooltipFormPreview';

export interface CardFormPreviewProps {
  className?: string;

  name: string;
  href: Url;
  img: string;

  description?: string;
  headerComponent?: ReactNode;
  contextComponent?: ReactNode;

  onFile?: Dispatch<File>;
  onClick?: Dispatch<void>;
  setOptions?: Partial<{ loading: boolean }>;

  style?: CSSProperties;
}

export default forwardRef<HTMLDivElement, CardFormPreviewProps>(
  function CardFormPreview(props: CardFormPreviewProps, ref) {
    const loading = (value: ReactNode, className: string, repeat?: number) =>
      props.setOptions?.loading ? (
        <div className="flex flex-col w-full">
          {Array(repeat || 1)
            .fill(0)
            .map((_, index) => (
              <span
                key={index}
                className={`animate-pulse bg-gray-200 block rounded ${className}`}
              />
            ))}
        </div>
      ) : (
        value
      );

    return (
      <div
        ref={ref}
        className={`flex flex-col p-3 rounded border w-96 h-32 border-gray-400 justify-between bg-white ${
          props.className ?? ''
        }`}
        style={props.style}
        onClick={() => props.onClick?.()}
      >
        <div className="flex items-center w-full mb-1">
          {loading(
            <>
              <FontAwesomeIcon
                className="ml-0.5 mr-2 text-gray-400"
                icon={faBookmark}
              />
              <Link
                className="group font-medium text-sky-600 hover:underline truncate max-w-48"
                href={props.href}
              >
                {props.name}
                <TooltipFormPreview
                  value={props.name}
                  setOptions={{ color: 'bg-gray-600 text-white' }}
                />
              </Link>
            </>,
            'h-2 ',
          )}
          {loading(props.headerComponent, 'ml-2.5 h-2 w-10')}
        </div>
        <div className="flex">
          <div className="pr-2">
            <span className="text-xs line-clamp-3 h-12 text-gray-600">
              {loading(props.description, 'mb-2 h-2 w-60', 2)}
            </span>

            {loading(props.contextComponent, 'h-2 w-20')}
          </div>

          {loading(
            <ImgFormElement
              img={props.img}
              onFile={props.onFile}
              setOptions={{ imgSize: 'h-16 aspect-1', margin: 'ml-auto' }}
            />,
            'ml-auto h-16 w-16',
          )}
        </div>
      </div>
    );
  },
);

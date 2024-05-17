import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, useRef } from 'react';

export interface DragDropProps {
  className?: string;

  title?: string;
  accept?: string;
  onFiles?: Dispatch<File[]>;
  setOptions?: Partial<{ panelHeight: string }>;
}

export default function DragDrop(props: DragDropProps) {
  const imgRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`px-5 pt-3 pb-8 ${props.className ?? ''}`}>
      <span className="text-sm font-medium text-gray-900">{props.title}</span>
      <div
        className={`flex flex-col mt-2 px-6 py-10 justify-center text-center rounded border border-dashed border-gray-900/25 focus:outline-none ${
          props.setOptions?.panelHeight ?? 'h-72'
        }`}
      >
        <FontAwesomeIcon
          icon={faImage}
          className="mx-auto h-12 w-12 text-gray-300"
        />
        <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
          <span
            className="font-semibold text-indigo-600 focus:outline-none hover:text-indigo-500 cursor-pointer"
            onClick={() => imgRef.current?.click()}
          >
            Upload a file
          </span>

          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF</p>

        <input
          ref={imgRef}
          className="hidden"
          type="file"
          accept={props.accept}
          onChange={(event) => props.onFiles(Array.from(event.target.files))}
        />
      </div>
    </div>
  );
}

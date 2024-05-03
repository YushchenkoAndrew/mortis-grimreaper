import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, useRef } from 'react';

export interface ImgFormElementProps {
  img: string;
  onFile?: Dispatch<File>;
  setOptions?: Partial<{ imgSize: string; margin: string }>;
}

export default function ImgFormElement(props: ImgFormElementProps) {
  const imgRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`block relative group ${props.setOptions?.margin ?? 'mr-3'} ${
        props.onFile ? 'cursor-pointer' : ''
      } ${props.setOptions?.imgSize ?? 'h-14 w-14 '}`}
      onClick={() => imgRef.current.click()}
    >
      <input
        ref={imgRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files[0];
          if (!file) return;

          return props.onFile(file);
        }}
      />
      <span
        className={`absolute top-0 left-0 h-full w-full rounded group-hover:bg-gray-500 ${
          props.onFile ? 'block' : 'hidden'
        }`}
      >
        <div className="hidden group-hover:flex w-full h-full justify-center items-center">
          <FontAwesomeIcon
            className="text-2xl text-gray-50 mix-blend-screen"
            icon={faPenToSquare}
          />
        </div>
      </span>
      <img
        className="relative block top-0 left-0 h-full w-full rounded mix-blend-multiply"
        src={props.img}
        alt="thumbnail"
      />
    </div>
  );
}

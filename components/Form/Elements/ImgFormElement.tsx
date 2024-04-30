import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, useRef } from 'react';

export interface ImgFormElementProps {
  img: string;
  onFile: Dispatch<File>;
}

export default function ImgFormElement(props: ImgFormElementProps) {
  const imgRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="block relative group h-14 w-14 mr-3 cursor-pointer"
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
      <span className="absolute block top-0 left-0 h-full w-full rounded group-hover:bg-gray-500">
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

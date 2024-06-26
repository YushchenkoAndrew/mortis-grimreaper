import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, useState } from 'react';
import { useImage } from '../../../hooks/useImage';
import DragDrop from '../../Container/DragDrop';
import PopupFormElement from './PopupFormElement';

export interface ImgFormElementProps {
  img: string;
  onFile?: Dispatch<File>;
  setOptions?: Partial<{ imgSize: string; margin: string }>;
}

export default function ImgFormElement(props: ImgFormElementProps) {
  const [open, setOpen] = useState(false);

  useImage(props.img);

  return (
    <>
      <div
        className={`block relative group ${
          props.setOptions?.margin ?? 'mr-3'
        } ${props.onFile ? 'cursor-pointer' : ''} ${
          props.setOptions?.imgSize ?? 'h-14 w-14 '
        }`}
        onClick={() => props.onFile && setOpen(true)}
      >
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

      <PopupFormElement
        open={open}
        onClose={() => setOpen(false)}
        setOptions={{
          panelSize: 'sm:w-full sm:max-w-2xl',
        }}
      >
        <DragDrop
          title="Thumbnail image"
          accept="image/*"
          onFiles={(files) => {
            if (files[0]) props.onFile(files[0]);
            setOpen(false);
          }}
          setOptions={{
            panelHeight: 'h-72',
          }}
        />
      </PopupFormElement>
    </>
  );
}

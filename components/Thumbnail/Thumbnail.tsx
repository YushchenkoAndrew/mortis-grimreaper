import Link from 'next/link';
import { BehaviorProps } from './Behavior';
import styles from './Thumbnail.module.scss';

export interface ThumbnailProps {
  img: string;
  title?: string;
  description?: string;

  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  curtain?: true;

  Behavior?: React.ComponentType<BehaviorProps>;
}

export default function Thumbnail({ Behavior, ...props }: ThumbnailProps) {
  return (
    <div className="max-w-sm max-h-96 relative group">
      <Link
        className="block relative"
        href={props.href}
        target={props.target || '_self'}
      >
        {props.curtain ? (
          <>
            <span className="absolute top-0 left-0 w-full h-full bg-gray-500" />
            {/* <span className="absolute block top-0 left-0 w-full h-full bg-white" /> */}
          </>
        ) : (
          <></>
        )}

        <img
          className="relative block top-0 left-0 w-fit h-fit mix-blend-multiply"
          src={props.img}
          alt={`Thumbnail: ${props.title || ''}`}
        />
        <div className="absolute top-1/3">
          <h4 className="text-white text-xl items-center text-center text-Abstract">
            {Behavior ? <Behavior value={props.title} /> : props.title}
          </h4>
          <p className="mt-8 text-white items-center text-center text-xl text-Roboto-Thin">
            {Behavior ? (
              <Behavior value={props.description} />
            ) : (
              props.description
            )}
          </p>
        </div>
      </Link>
    </div>
  );
}

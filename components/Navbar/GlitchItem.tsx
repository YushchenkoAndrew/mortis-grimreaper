import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NumberService, StringService } from '../../lib';
import styles from './GlitchItem.module.scss';
import { NavbarItemProps } from './NavbarItem';

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function GlitchItem(props: NavbarItemProps) {
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(-1);
  const [glitch, setGlitch] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!props.active) return setIndex(-1);

      setCount(count + 1);
      if (count > 10 && count < 20) return setIndex(-1);

      setIndex(NumberService.random(props.name.length));
      setGlitch(NumberService.random(GLITCH_CHARS.length));
    }, 150);
    return () => clearInterval(interval);
  });

  return (
    <Link
      href={props.href}
      className={`${props.className ?? ''} ${styles['glitch-rgb']}`}
      target={props.target ?? '_self'}
      data-glitch={
        index == -1
          ? props.name
          : StringService.replaceAt(
              props.name,
              GLITCH_CHARS.charAt(glitch),
              index,
            )
      }
    >
      {props.name.split('').map((char, i) => (
        <div key={i} className={i == index ? 'text-gray-500' : 'text-white'}>
          {i == index ? GLITCH_CHARS.charAt(glitch) : char}
        </div>
      ))}
    </Link>
  );
}

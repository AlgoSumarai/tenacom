import type { ReactNode } from 'react';
import Reveal from './Reveal';
export default function ImageReveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`image-reveal ${className}`}>
      <div className="image-reveal-content">{children}</div>
      <span className="image-reveal-mask" aria-hidden="true" />
    </Reveal>
  );
}

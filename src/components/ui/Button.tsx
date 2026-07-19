import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  withArrow?: boolean;
};

const variants: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

export default function Button({
  children, to, href, variant = 'primary', className = '', onClick, type = 'button', withArrow = false,
}: Props) {
  const cls = `${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {withArrow && <ArrowRight className="h-4 w-4" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {content}
    </button>
  );
}

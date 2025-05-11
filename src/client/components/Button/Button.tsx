import styles from './Button.module.sass'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

export const Button = ({ onClick, disabled, children }: ButtonProps) => {
  return (
    <button type="button" onClick={onClick} className={styles.button} disabled={disabled}>
      {children}
    </button>
  )
}

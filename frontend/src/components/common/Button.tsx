import styles from './Button.module.css'

interface ButtonProps {
  onClick: () => void
  text: string | undefined
}

export const ShareButton: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <button
      className={styles.shareButtonRoot}
      onClick={onClick}
      title="Share">
      🔗 {text}
    </button>
  )
}

export const HistoryButton: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <button
      className={styles.historyButtonRoot}
      onClick={onClick}
      title={text}>
      {text}
    </button>
  )
}

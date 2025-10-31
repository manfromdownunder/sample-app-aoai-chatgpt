import { useContext, useState, useRef, useEffect } from 'react'
import { resizeImage } from '../../utils/resizeImage'
import { ChatMessage } from '../../api'
import { AppStateContext } from '../../state/AppProvider'
import styles from './QuestionInputModern.module.css'

interface Props {
  onSend: (question: ChatMessage['content'], id?: string) => void
  disabled: boolean
  placeholder?: string
  clearOnSend?: boolean
  conversationId?: string
  actionButtons?: React.ReactNode
}

export const QuestionInputModern = ({ onSend, disabled, placeholder, clearOnSend, conversationId, actionButtons }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
    }
  }

  useEffect(() => {
    autoResizeTextarea()
  }, [question])

  const appStateContext = useContext(AppStateContext)
  const OYD_ENABLED = appStateContext?.state.frontendSettings?.oyd_enabled || false

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await convertToBase64(file)
    }
  }

  const convertToBase64 = async (file: Blob) => {
    try {
      const resizedBase64 = await resizeImage(file, 800, 800)
      setBase64Image(resizedBase64)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return
    }

    const questionTest: ChatMessage['content'] = base64Image
      ? [{ type: 'text', text: question }, { type: 'image_url', image_url: { url: base64Image } }]
      : question.toString()

    if (conversationId && questionTest !== undefined) {
      onSend(questionTest, conversationId)
      setBase64Image(null)
    } else {
      onSend(questionTest)
      setBase64Image(null)
    }

    if (clearOnSend) {
      setQuestion('')
    }
  }

  const onEnterPress = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault()
      sendQuestion()
    }
  }

  const sendQuestionDisabled = disabled || !question.trim()

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={placeholder || 'Type your question...'}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onEnterPress}
          disabled={disabled}
          rows={1}
        />
      </div>
      <div className={styles.bottomRow}>
        {actionButtons && <div className={styles.actionButtonsContainer}>{actionButtons}</div>}
      </div>
      {base64Image && (
        <div className={styles.imagePreview}>
          <img src={base64Image} alt="Uploaded" />
          <button
            className={styles.removeImage}
            onClick={() => setBase64Image(null)}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

import Modal from './Modal'
import SignaturePadInput from './SignaturePadInput'

export default function SignatureModal({ title, initialValue, onSave, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <SignaturePadInput
        initialValue={initialValue}
        onSave={(dataUrl) => {
          onSave(dataUrl)
          onClose()
        }}
        onCancel={onClose}
      />
    </Modal>
  )
}

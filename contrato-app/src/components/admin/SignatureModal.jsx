import Modal from './Modal'
import SignaturePadInput from './SignaturePadInput'

export default function SignatureModal({ title, initialValue, firmaGuardada, onSave, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <SignaturePadInput
        initialValue={initialValue}
        firmaGuardada={firmaGuardada}
        onSave={(dataUrl) => {
          onSave(dataUrl)
          onClose()
        }}
        onCancel={onClose}
      />
    </Modal>
  )
}

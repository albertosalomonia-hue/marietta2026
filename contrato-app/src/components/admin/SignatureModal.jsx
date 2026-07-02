import Modal from './Modal'
import SignaturePadInput from './SignaturePadInput'

export default function SignatureModal({ title, initialPath, firmaGuardadaPath, onSave, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <SignaturePadInput
        initialPath={initialPath}
        firmaGuardadaPath={firmaGuardadaPath}
        onSave={(result) => {
          onSave(result)
          onClose()
        }}
        onCancel={onClose}
      />
    </Modal>
  )
}

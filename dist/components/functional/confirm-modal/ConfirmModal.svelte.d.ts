type ConfirmModalProps = {
    title: string;
    text?: string;
    onClose: (result: boolean) => void;
    cancelText?: string;
    confirmText?: string;
};
declare const ConfirmModal: import("svelte").Component<ConfirmModalProps, {}, "">;
type ConfirmModal = ReturnType<typeof ConfirmModal>;
export default ConfirmModal;

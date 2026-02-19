import { useId } from "../utils/useId";
import { SvelteMap } from "svelte/reactivity";
const instances = new SvelteMap();
const open = (component, props, { className, destroyDelay } = { destroyDelay: 250 }) => {
    const id = useId();
    return new Promise((resolve, reject) => {
        const onClose = (result) => {
            const modal = instances.get(id);
            if (modal)
                modal.resolveHandled = true;
            resolve(result);
        };
        const modal = { id, className, component, props: { ...props, onClose }, destroyDelay, resolve, resolveHandled: false };
        instances.set(id, modal);
    });
};
const close = (id) => {
    const modal = instances.get(id);
    if (!modal)
        return;
    setTimeout(() => {
        if (!modal.resolveHandled) {
            modal.resolve(undefined);
            modal.resolveHandled = true;
        }
        instances.delete(id);
    }, modal.destroyDelay);
};
import { ConfirmModal } from "../components/functional/confirm-modal";
const confirm = (title, text, { cancelText, confirmText } = {}) => {
    return open(ConfirmModal, {
        title,
        text,
        cancelText,
        confirmText
    }, { destroyDelay: 250 });
};
export const modalService = {
    get instances() {
        return instances.values();
    },
    open,
    close,
    confirm
};

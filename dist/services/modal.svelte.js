import { useId } from "../utils/useId";
import { SvelteMap } from "svelte/reactivity";
import { ConfirmModal } from "../components/functional/confirm-modal";
const instances = new SvelteMap();
const open = (component, props, options = { destroyDelay: 250 }) => {
    const id = useId();
    return new Promise((resolve, reject) => {
        const onClose = (result) => {
            const modal = instances.get(id);
            if (modal)
                modal.resolveHandled = true;
            resolve(result);
        };
        const modal = {
            id,
            className: options.className,
            position: options.position,
            outsideBehavior: options.outsideBehavior,
            component,
            props: { ...props, onClose },
            destroyDelay: options.destroyDelay ?? 250,
            resolve,
            resolveHandled: false
        };
        instances.set(id, modal);
    });
};
const close = (id) => {
    const modal = instances.get(id);
    if (!modal)
        return;
    if (!modal.resolveHandled) {
        modal.resolve(undefined);
        modal.resolveHandled = true;
    }
    setTimeout(() => {
        instances.delete(id);
    }, modal.destroyDelay);
};
const confirm = (title, text, { cancelText, confirmText } = {}) => {
    return open(ConfirmModal, {
        title,
        text,
        cancelText,
        confirmText
    });
};
export const modalService = {
    get instances() {
        return instances.values();
    },
    open,
    close,
    confirm
};

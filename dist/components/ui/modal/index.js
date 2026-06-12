import Body from "./ModalBody.svelte";
import Content from "./ModalContent.svelte";
import Footer from "./ModalFooter.svelte";
import Header from "./ModalHeader.svelte";
import Root from "./ModalRoot.svelte";
import Trigger from "./ModalTrigger.svelte";
export const Modal = {
    Root,
    Trigger,
    Content,
    Header,
    Body,
    Footer
};
export { useModal, useOptionalModal } from "./context";

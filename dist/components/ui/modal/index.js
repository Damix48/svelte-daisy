import Root from "./ModalRoot.svelte";
import Trigger from "./ModalTrigger.svelte";
import Content from "./ModalContent.svelte";
import Header from "./ModalHeader.svelte";
import Body from "./ModalBody.svelte";
import Footer from "./ModalFooter.svelte";
export const Modal = {
    Root,
    Trigger,
    Content,
    Header,
    Body,
    Footer
};
export { useModal } from "./context";

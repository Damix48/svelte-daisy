import type { Component, ComponentProps } from "svelte";
import type { ModalContentProps } from "../components/ui/modal";
type ModalInstance<T extends Component<any, any, any>> = {
    id: string;
    className?: string;
    component: T;
    props: ComponentProps<T>;
    destroyDelay: number;
    resolve: (arg: any) => void;
    resolveHandled: boolean;
} & Pick<ModalContentProps, "position" | "outsideBehavior">;
type OpenModalOptions<T> = {
    className?: string;
    destroyDelay?: number;
} & Pick<ModalInstance<T>, "position" | "outsideBehavior">;
type ExtractOnCloseResult<T> = T extends {
    onClose?: (result: infer R) => any;
} ? R : undefined;
export declare const modalService: {
    readonly instances: MapIterator<ModalInstance<Component<any, any, any>>>;
    open: <T extends Component<ComponentProps<T>, any, any>>(component: T, props: Omit<ComponentProps<T>, "onClose">, options?: OpenModalOptions<T>) => Promise<ExtractOnCloseResult<ComponentProps<T>>>;
    close: (id: string) => void;
    confirm: (title: string, text?: string, { cancelText, confirmText }?: {
        cancelText?: string;
        confirmText?: string;
    }) => Promise<boolean>;
};
export {};

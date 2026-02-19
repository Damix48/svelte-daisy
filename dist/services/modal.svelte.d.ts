import type { Component, ComponentProps } from "svelte";
type ModalInstance<T extends Component<any, any, any>> = {
    id: string;
    className?: string;
    component: T;
    props: ComponentProps<T>;
    destroyDelay: number;
    resolve: (arg: any) => void;
    resolveHandled: boolean;
};
type ExtractOnCloseResult<T> = T extends {
    onClose?: (result: infer R) => any;
} ? R : undefined;
export declare const modalService: {
    readonly instances: MapIterator<ModalInstance<Component<any, any, any>>>;
    open: <T extends Component<ComponentProps<T>, any, any>>(component: T, props: Omit<ComponentProps<T>, "onClose">, { className, destroyDelay }?: {
        className?: string;
        destroyDelay: number;
    }) => Promise<ExtractOnCloseResult<ComponentProps<T>>>;
    close: (id: string) => void;
    confirm: (title: string, text?: string, { cancelText, confirmText }?: {
        cancelText?: string;
        confirmText?: string;
    }) => Promise<boolean>;
};
export {};

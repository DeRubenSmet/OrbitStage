/// <reference types="react" />
declare type ReferrerPolicy = "no-referrer-when-downgrade" | "no-referrer" | "origin-when-cross-origin" | "origin" | "same-origin" | "strict-origin-when-cross-origin" | "strict-origin" | "unsafe-url";
declare type CrossOrigin = "anonymous" | "use-credentials";
declare type ScriptDescriptor = {
    async?: boolean;
    crossOrigin?: CrossOrigin;
    defer?: boolean;
    integrity?: string;
    noModule?: boolean;
    nonce?: string;
    referrerPolicy?: ReferrerPolicy;
    src: string;
    type?: string;
};
export declare type ExternalScriptsFunction = () => ScriptDescriptor[];
export declare function ExternalScripts(): JSX.Element;
export {};

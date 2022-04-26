/// <reference types="react" />
import type { AppData, LinkDescriptor } from "@remix-run/server-runtime";
export interface DynamicLinksFunction<Data extends AppData = AppData> {
    (args: {
        data: Data;
    }): LinkDescriptor[];
}
export declare function DynamicLinks(): JSX.Element;

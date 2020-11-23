import React, { ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function Error(props: { children: ReactNode }) {
    return (
        <div
            className="container mx-auto my-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded"
            role="alert"
        >
            <FiAlertCircle /> {props.children}
        </div>
    );
}

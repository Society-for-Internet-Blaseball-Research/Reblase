import React, {ReactNode} from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function Error(props: { children: ReactNode }) {
    return (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded" role="alert">
            <FiAlertCircle /> {props.children}
        </div>
    )
}
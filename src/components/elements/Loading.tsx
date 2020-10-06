import React from "react";
import Spinner from "./Spinner";

export function Loading() {
    return (
        <div className="my-8 text-lg text-center">
            <Spinner /> <span className="text-gray-600">Loading...</span>
        </div>
    );
}

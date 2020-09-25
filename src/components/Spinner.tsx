import React from "react";

import {CgSpinner} from "react-icons/cg/index";

export default function Spinner() {
    return <span 
        className="inline-block animate-spin align-middle relative" 
        style={{fontSize: "1.25em", top: "-0.05em"}}
    >
        <CgSpinner  />
    </span>;
}
import React from "react";
import { ProgressBar } from 'primereact/progressbar';

export default function Loader() {

    return (
        <div className="m-4 p-2">
            <span className="textWhite">In attesa di risposta dal server...</span>
            <ProgressBar className="mt-2" mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
        </div>
    );
}
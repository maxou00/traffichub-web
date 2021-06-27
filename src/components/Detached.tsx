import { useLayoutEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

interface Props {
    unmountOnExit?: boolean;
}

export function Detached(props: PropsWithChildren<Props> ){
    const [wrapper, setWrapper] = useState<HTMLDivElement>();

    useLayoutEffect(() => {
        let wrap = document.createElement("div");
        wrap.classList.add("modal-wrapper");
        setWrapper(wrap);
        document.body.appendChild(wrap);

        return () => {
            if(props.unmountOnExit) {
                document.body.removeChild(wrap);
            }
        }
    },[setWrapper]);

    return <>
        {
            wrapper && createPortal(
                props.children,
                wrapper
            )
        }
    </>
}
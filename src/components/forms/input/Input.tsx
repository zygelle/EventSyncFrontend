import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return(
        <input
        className="border border-slate-300 h-9 rounded-md outline-none px-2 mb-4 "
        {...props}
        />

    )
}
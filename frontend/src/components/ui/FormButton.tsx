import { ButtonHTMLAttributes } from "react";

type Props = {
    children: React.ReactNode;
     className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const FormButton = ({children, className= '',  ...props}: Props)=>{
    return(
        <button
        {...props}
        className={`w-full py-2 rounded ${className}`}
        >
            {children}
        </button>
    )
}
export default FormButton;
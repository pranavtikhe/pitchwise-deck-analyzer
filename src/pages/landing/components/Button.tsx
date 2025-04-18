import React from "react";
import { clsx } from "clsx";
import styles from "./Button.module.scss";

interface ButtonProps {
    className?: string;
    title: string;
    href?: string;
    onClick?: () => void;
    [key: string]: any;
}

const Button = ({ className, title, href, onClick, ...props }: ButtonProps) => {
    const buttonClasses = clsx(styles.button, className);

    if (href) {
        return (
            <a href={href} className={buttonClasses} {...props}>
                {title}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={buttonClasses} {...props}>
            {title}
        </button>
    );
};

export default Button; 
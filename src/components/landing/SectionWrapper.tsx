import { ReactNode } from "react";

interface SectionWrapperProps {
id?: string;
children: ReactNode;
className?: string;
}

export const SectionWrapper = ({ id, children, className = "py-20" }: SectionWrapperProps) => {
return (
<section id={id} className={`${className} w-full`}> <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div> </section>
);
};

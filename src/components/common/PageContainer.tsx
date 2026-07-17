import { FC, ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: number | string;
}

export const PageContainer: FC<PageContainerProps> = ({ children, maxWidth = 1440 }) => {
  return (
    <div
      className="mx-auto flex flex-col gap-6"
      style={{ maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth }}
    >
      {children}
    </div>
  );
};

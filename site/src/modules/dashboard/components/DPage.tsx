import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  desc?: string;
  headerCpts?: React.ReactNode;
  subheader?: string;
};

const DPage = ({ children, title, desc, headerCpts, subheader }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between px-6 h-16">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subheader && <span className="text-sm">{subheader}</span>}
          </div>
          {desc && <p>{desc}</p>}
        </div>
        {headerCpts}
      </div>
      {children}
    </div>
  );
};
export default DPage;

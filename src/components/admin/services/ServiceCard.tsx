import { ReactNode } from "react";

interface Props {
  name: string;
  description: string;
  children?:ReactNode
}

const ServiceCard = ({ name, description, children}: Props) => {
  return (
    <div
      className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm text-center hover:shadow-md transition"
    >
      <div className="w-14 h-14 mx-auto bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <h4 className="text-lg font-bold text-slate-800 mb-2">{name}</h4>
      <p className="text-sm text-gray-500 mb-4 min-h-[2.5rem] md:min-h-[3rem] line-clamp-2 md:line-clamp-3">{description}</p>
      {children}
    </div>
  );
};

export default ServiceCard;

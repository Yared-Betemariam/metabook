import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
  message?: string;
  skeleton?: boolean;
}

const FormSuccess = ({ message, skeleton }: FormSuccessProps) => {
  if (!message) return;
  return skeleton ? (
    <div className="flex items-center gap-3 brightness-150 text-emerald-700/80 text-sm">
      <FaCheckCircle className="min-w-4" />
      <span>{message}</span>
    </div>
  ) : (
    <div className="flex items-center space-x-3 bg-emerald-500/10 brightness-150 text-emerald-700/80 text-sm rounded-md shadow-sm py-2 px-4">
      <FaCheckCircle className="min-w-4" />
      <span>{message}</span>
    </div>
  );
};
export default FormSuccess;

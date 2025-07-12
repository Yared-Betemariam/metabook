import { FaExclamationTriangle } from "react-icons/fa";

interface FormErrorProps {
  message?: string;
  skeleton?: boolean;
}

const FormError = ({ message, skeleton }: FormErrorProps) => {
  if (!message) return;
  return skeleton ? (
    <div className="flex items-center gap-3 brightness-150 text-destructive/80 text-sm">
      <FaExclamationTriangle className="min-w-4" />
      <span>{message}</span>
    </div>
  ) : (
    <div className="flex items-center gap-3 bg-destructive/10 brightness-150 text-destructive/80 text-sm rounded-md shadow-sm py-2 px-4">
      <FaExclamationTriangle className="min-w-4" />
      <span>{message}</span>
    </div>
  );
};
export default FormError;

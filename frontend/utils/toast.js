import { toast } from "react-toastify";

export const showSuccess = (message) => {
  toast.success(message, { position: "top-right" });
};

export const showError = (message) => {
  toast.error(message, { position: "top-right" });
};

export const showInfo = (message) => {
  toast.info(message, { position: "top-right" });
};

export const showWarning = (message) => {
  toast.warning(message, { position: "top-right" });
};

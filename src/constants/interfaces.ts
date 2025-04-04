export interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  start?: boolean;
  end?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface InputProps {
  type?: "text" | "password" | "email";
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  showPasswordToggle?: boolean;
  disabled?: boolean;
}

export interface AvailableDaysProps {
  selectedDays: string[];
  setSelectedDays: React.Dispatch<React.SetStateAction<string[]>>;
  disabled?: boolean;
}

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  theme?: "neon" | "hologram" | "cyber" | "quantum";
  loadingText?: string;
  showText?: boolean;
  showProgress?: boolean;
  progressValue?: number;
}

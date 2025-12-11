export interface MenuItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  showDelete?: boolean;
}

export interface PageHeaderAction {
  label: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick: () => void;
}

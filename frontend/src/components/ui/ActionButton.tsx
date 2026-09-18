/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/components/ui/ActionButton.tsx
 * Function: Renders a consistently styled button for user-triggered actions
 */

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({
  label,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button className="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

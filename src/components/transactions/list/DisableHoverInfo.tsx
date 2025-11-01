import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useTransactionHoverContext } from "~/hooks/use-transaction-hover-context";

const id = "disable-hover";
export function DisableHoverInfo() {
  const { disableHover, setDisableHover } = useTransactionHoverContext();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={id}
        checked={disableHover}
        onCheckedChange={(checked) => {
          setDisableHover(checked);
          localStorage.setItem(id, String(checked));
        }}
      />
      <Label htmlFor={id}>Transaction Details</Label>
    </div>
  );
}

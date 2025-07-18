import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/main";
import { AltArrowRight, Box, PasswordMinimalisticInput } from "solar-icon-set";

const Sidebar = () => {
  const { panel, setPanel } = useAppStore();

  const onChangeActivePanel = (value: string) => {
    if (panel === value) return setPanel(null);
    setPanel(value);
  };

  return (
    <aside className="w-[3.5rem] relative top-0 left-0 text-2xl font-medium h-full">
      <nav className="flex flex-col gap-4 items-center justify-center h-max pt-5 ">
        <div
          onClick={() => onChangeActivePanel("bubbles")}
          className={cn("text-background/70 hover:text-background transition cursor-pointer w-3/4 flex items-center justify-center py-2 rounded-lg", panel === "bubbles" && "bg-green-50 text-foreground hover:text-foreground")}
        >
          <Box size={20} />
        </div>
        <div
          onClick={() => onChangeActivePanel("inputs")}
          className={cn("text-background/70 hover:text-background transition cursor-pointer w-3/4 flex items-center justify-center py-2 rounded-lg", panel === "inputs" && "bg-green-50 text-foreground hover:text-foreground")}
        >
          <PasswordMinimalisticInput size={20} />
        </div>
      </nav>
      <div className="w-7 h-7 absolute bottom-2 left-1/2 -translate-x-1/2 border border-background rounded-full text-background flex items-center justify-center hover:bg-white hover:text-foreground transition cursor-pointer mb-2">
        <AltArrowRight size={18} />
      </div>
    </aside>
  );
};

export default Sidebar;

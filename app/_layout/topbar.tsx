import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/main";
import { Home } from "solar-icon-set";

const Topbar = () => {
  const { setTestPanel, isTestPanel } = useAppStore((state) => state);
  return (
    <div className="w-full px-1 py-2 fixed top-0 z-10 h-[3rem] text-white flex items-center justify-between pr-6">
      <div className="h-full flex items-center px-3 mt-2">
        <Home size={20} />
      </div>
      <Button onClick={() => setTestPanel(!isTestPanel)} variant={"outline"} className="px-6">
        Test
      </Button>
    </div>
  );
};

export default Topbar;

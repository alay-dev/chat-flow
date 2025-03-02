"use client";

import Main from "@/app/_layout/main";
import { BubblePanel } from "@/app/builder/_panels/bubble";
import { InputPanel } from "@/app/builder/_panels/input";
import { useAppStore } from "@/store/main";
import { ReactFlowProvider } from "@xyflow/react";
import Test from "./_panels/test";
import Canvas from "./_views/canvas";

const Builder = () => {
  const panel = useAppStore((state) => state.panel);
  const isTestPanel = useAppStore((state) => state.isTestPanel);

  return (
    <Main>
      <ReactFlowProvider>
        <div className="bg-gray-50 w-full h-full rounded-tl-xl overflow-hidden relative">
          <Canvas />

          <div className="absolute top-0 left-0 h-full w-[25rem] z-20">
            {(() => {
              switch (panel) {
                case "bubbles":
                  return <BubblePanel />;
                case "inputs":
                  return <InputPanel />;
                default:
                  return null;
              }
            })()}
          </div>
          {isTestPanel ? <Test /> : null}
        </div>
      </ReactFlowProvider>
    </Main>
  );
};

export default Builder;

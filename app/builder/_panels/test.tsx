import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/main";
import { Group, GroupElement } from "@/types/common";
import { useReactFlow, useEdges, Edge } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CloseCircle } from "solar-icon-set";

const Test = () => {
  const setTestPanel = useAppStore((state) => state.setTestPanel);
  const { getNode } = useReactFlow<Group, Edge>();
  const edges = useEdges();
  const [testID, setTestID] = useState(nanoid());
  const [messages, setMessages] = useState<GroupElement[]>([]);
  const [inputs, setInputs] = useState(new Map());
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const getNext = useCallback(
    (id: string, current: Group[]) => {
      const targetId = edges.find((item) => item.source === id)?.target;
      if (!targetId) return current;

      const group = getNode(targetId)!;
      return getNext(targetId, [...current, group]);
    },
    [edges, getNode]
  );

  const elements: GroupElement[] = useMemo(() => {
    if (!testID) return [];
    const start = getNode("start");
    if (!start) return [];
    const groups = getNext(start.id, [start]);

    return groups.map((grp) => [...grp.data.group]).flat();
  }, [getNext, getNode, testID]);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!elements?.length) return;
    if (currentMessageIndex < elements.length && !waitingForInput) {
      const nextMessage = elements[currentMessageIndex];

      if (nextMessage.type === "input") {
        setWaitingForInput(true);
        setMessages((prev) => [...prev, nextMessage]);
      } else {
        setTimeout(() => {
          setMessages((prev) => [...prev, nextMessage]);
          setCurrentMessageIndex((prev) => prev + 1);
        }, 1000);
      }
    }

    scrollToBottom();
  }, [currentMessageIndex, elements, waitingForInput]);

  const handleSendMessage = (input: string) => {
    // Add user input to messages
    // setMessages((prev) => [...prev, { type: "user", text: input }]);
    // setInput("");
    // const nextMessage = elements[currentMessageIndex];
    // setMessages((prev) => [...prev, nextMessage]);

    // Continue bot messages

    const inputID = messages[currentMessageIndex].id;

    setInputs((prev) => {
      const newMap = new Map(prev);
      newMap.set(inputID, input);
      return newMap;
    });

    setTimeout(() => {
      setCurrentMessageIndex((prev) => prev + 1);
      setWaitingForInput(false);
    }, 100);
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[30rem] z-20 bg-background shadow-xl p-5 border-r ">
      <div onClick={() => setTestPanel(false)} className="absolute top-2 right-2 hover:bg-gray-100 transition duration-200 w-8 h-8 flex items-center justify-center rounded-md text-gray-500 cursor-pointer">
        <CloseCircle size={20} className="m-0 p-0 flex" />
      </div>
      <div className="">
        <Button onClick={() => setTestID(nanoid())} variant={"outline"}>
          Restart
        </Button>
      </div>
      <ScrollArea ref={chatRef} className="bg-gray-100 h-[82vh] mt-5 rounded-md">
        <div className="flex flex-col px-3 py-4 ">
          {messages.map((msg, i) => {
            const isBotAvatar = (i === 0 && msg.type === "bubble") || (i !== 0 && msg.type === "bubble" && messages[i - 1].type === "input");
            switch (msg.type) {
              case "bubble":
                return (
                  <div className={cn("flex gap-2 mt-2", i !== 0 && messages[i - 1].type !== messages[i].type && "mt-5")} key={msg.id}>
                    <Avatar className={cn("w-8 h-8", !isBotAvatar && "opacity-0")}>
                      <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                    <BubbleElement {...msg} />
                  </div>
                );

              case "input":
                return (
                  <div key={msg.id} className={cn("self-end  w-4/5 mt-2", i !== 0 && messages[i - 1].type !== messages[i].type && "mt-5")}>
                    <InputElement isAnswered={inputs.has(msg.id)} element={msg} handleSendMessage={handleSendMessage} />
                  </div>
                );
            }
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Test;

const BubbleElement = (element: GroupElement) => {
  switch (element.nodeType) {
    case "TEXT":
      return (
        <div className="p-3 rounded-lg bg-white w-3/5 border">
          <p className="leading-tight text-sm">{element.text}</p>
        </div>
      );
    case "IMAGE":
      return (
        <div className="w-3/5 rounded-lg overflow-hidden">
          <img src={element.image} alt="" className="max-h-64 w-full object-cover" />
        </div>
      );
  }
};

const InputElement = ({ element, handleSendMessage, isAnswered }: { element: GroupElement; handleSendMessage: (val: string) => void; isAnswered: boolean }) => {
  const [input, setInput] = useState("");

  switch (element.nodeType) {
    case "TEXT":
      return (
        <div className="flex gap-2">
          <Input placeholder={element.placeholder} value={input} onChange={(e) => setInput(e.target.value)} className="bg-white" />
          {!isAnswered ? <Button onClick={() => handleSendMessage(input)}>{element.buttonLabel}</Button> : null}
        </div>
      );
  }
};

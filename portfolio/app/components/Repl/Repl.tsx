import { useEffect, useState } from "react";
import ReplInput from "@/app/components/Repl/ReplInput";
import ReplLoading from "@/app/components/Repl/ReplLoading";
import { History } from "@app/components/History";
import { eventBus } from "@/lib/event-bus";
import { EVENTS } from "@app/constants/events";
import { HistoryItem, HISTORY_ITEM_TYPES } from "@app/components/History";
import useChat from "@lib/hooks/useChat";
import { EventBusSubmitEvent } from "@app/types/events";

export default function Repl() {
  const { isLoading, sendMessage } = useChat();

  useEffect(() => {
    const unRegisterFn = eventBus.on(EVENTS.SUBMIT, (data) => executeReplCommand(data));
    return () => unRegisterFn();
  }, []);


  function executeReplCommand(data: EventBusSubmitEvent) {
    if (data?.message) {
      sendMessage(data.message).then((result) => {
        if (Array.isArray(result)) {
          result.forEach((item: any) => {
            const itemData: HistoryItem = {
              message: item?.output ?? "",
              type: HISTORY_ITEM_TYPES.RESULT
            }
            debugger
            eventBus.emit(EVENTS.EXECUTION_COMPLETE, itemData);
          });
        }
        }
      )
    }
  }

  return (
    <div>
      <History />
      <ReplLoading
        isVisible={ isLoading }
      />
      <ReplInput
        isVisible={ !isLoading }
      />
    </div>
  );
}

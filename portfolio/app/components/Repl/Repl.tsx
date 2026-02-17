import { useEffect, useState } from "react";
import ReplInput from "@/app/components/Repl/ReplInput";
import ReplLoading from "@/app/components/Repl/ReplLoading";
import History from "@/app/components/Repl/History";
import { eventBus } from "@/lib/event-bus";
import { EVENTS } from "@app/constants/events";
import { HistoryItem } from "@app/types/history";
import { HISTORY_ITEM_TYPES } from "@app/constants/history";

export default function Repl() {
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const unRegisterFn = eventBus.on(EVENTS.SUBMIT, (data) => executeReplCommand(data));
    return () => unRegisterFn();
  }, []);


  function executeReplCommand(item: HistoryItem) {
    setIsExecuting(true);
    const result: HistoryItem = {
      msg: item.msg,
      type: HISTORY_ITEM_TYPES.RESULT
    }

    setTimeout(() => {
      setIsExecuting(false);
      eventBus.emit(EVENTS.EXECUTION_COMPLETE, result);
    }, 1000)
  }

  return (
    <div>
      <History />
      <ReplLoading
        isVisible={ isExecuting }
      />
      <ReplInput
        isVisible={ !isExecuting }
      />
    </div>
  );
}

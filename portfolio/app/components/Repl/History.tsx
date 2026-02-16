import React, { useEffect, useState } from "react";
import styles from "./repl.module.css"
import { HistoryItem } from "@/app/types/history";
import { recordStorage } from "@app/utils/storage";
import { eventBus } from "@/lib/event-bus";
import { events } from "@app/constants/events";
import { HISTORY_ITEM_TYPES } from "@app/constants/history";

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(recordStorage.getRecords() ?? []);

    const unregisterSubmit = eventBus.on(events.SUBMIT, submitHandler);
    const unregisterCompete = eventBus.on(events.EXECUTION_COMPLETE, completeHandler);
    return () => {
      unregisterSubmit();
      unregisterCompete();
    };
  }, []);

  const completeHandler = (data: HistoryItem) => {
    setHistory((prevHistory) => [...prevHistory, data]);
  };

  const submitHandler = (data: HistoryItem) => {
    setHistory((prevHistory) => [...prevHistory, data]);
  }

  return history.map((item: HistoryItem, key) =>
    <div key={ item.msg + key } className="history-container">
      {item.type === HISTORY_ITEM_TYPES.COMMAND ? (
        <div className={ styles.inputContainer }>
          <span>$</span>
          <span>{ item.msg }</span>
        </div>
      ): (
        <div><p>{ item.msg }</p></div>
      )}
    </div>
  )
}
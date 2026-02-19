import React, { useEffect, useState } from "react";
import styles from "../Repl/repl.module.css"
import { HISTORY_ITEM_TYPES } from "./constants";
import { eventBus } from "@/lib/event-bus";
import { EVENTS } from "@app/constants/events";
import { HistoryItem } from "./types";

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // setHistory(recordStorage.getRecords() ?? []);

    const unregisterSubmit = eventBus.on(EVENTS.SUBMIT, submitHandler);
    const unregisterCompete = eventBus.on(EVENTS.EXECUTION_COMPLETE, completeHandler);
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
    <div key={ item.message + key } className="history-container">
      {item.type === HISTORY_ITEM_TYPES.COMMAND ? (
        <div className={ styles.inputContainer }>
          <span>$</span>
          <span>{ item.message }</span>
        </div>
      ): (
        <div><p>{ item.message }</p></div>
      )}
    </div>
  )
}
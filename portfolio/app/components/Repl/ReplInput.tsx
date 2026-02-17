import { Input } from "@/components/ui/input"
import React, { useEffect, useRef, useState } from "react"
import styles from "./repl.module.css"
import { eventBus } from "@/lib/event-bus"
import { EVENTS } from "@app/constants/events"
import { HistoryItem } from "@app/types/history"
import { HISTORY_ITEM_TYPES } from "@app/constants/history";

// TODO - form validation
export default function ReplInput({isVisible}: {
  isVisible: boolean;
}) {
  const [value, setValue] = useState("")
  const inputElementRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Keep focus on input
    document.addEventListener("click", handleClickOnPage);
  }, []);

  if (!isVisible) {
    return;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValue("");
    const submitData: HistoryItem = {
      msg: value,
      type: HISTORY_ITEM_TYPES.COMMAND
    }
    eventBus.emit(EVENTS.SUBMIT, submitData)
  }

  function handleClickOnPage() {
    inputElementRef.current?.focus();
  }

  return (
    <form onSubmit={ handleSubmit } className={ styles.inputContainer }>
      <span className="select-none">$</span>
      <label htmlFor="input-prompt" className="sr-only">Input Prompt</label>
      <Input
        id="input-prompt"
        ref={ inputElementRef }
        value={ value }
        onChange={ (e) => setValue(e.target.value) }
        autoFocus
        autoComplete="off"
      />
    </form>
  );
}

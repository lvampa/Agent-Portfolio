import { Input } from "@/components/ui/input"
import React, { useEffect, useRef, useState } from "react"
import styles from "./repl.module.css"
import { eventBus } from "@/lib/event-bus"
<<<<<<< Updated upstream
import { EVENTS } from "@app/constants/events"
import { HistoryItem } from "@app/types/history"
import { HISTORY_ITEM_TYPES } from "@app/constants/history";
=======
import { EventBusSubmitEvent } from "@app/types/events"
import { EVENTS } from "@app/constants/events"
>>>>>>> Stashed changes

// TODO - form validation
// @doc - Component emits submit event on form submit.
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
    const submitData: EventBusSubmitEvent = {
      message: value,
      type: EVENTS.SUBMIT
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

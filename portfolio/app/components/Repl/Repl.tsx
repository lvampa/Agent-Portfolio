'use client'

import { Input } from "@/components/ui/input"
import React, { useEffect, useRef, useState } from "react"

export default function Repl() {
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState<string[]>([])

  const inputElementRef = useRef<HTMLInputElement>(null)

  function handleClickOnPage() {
    inputElementRef.current?.focus();
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOnPage);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!command.trim()) return

    // Example behavior — you can replace with real command logic
    if (command === "help") {
      setOutput(prev => [...prev, "Available commands: help, clear, hello"])
    } else if (command === "clear") {
      setOutput([])
    } else if (command === "hello") {
      setOutput(prev => [...prev, "👋 Hello, human!"])
    } else {
      setOutput(prev => [...prev, `Unknown command: ${ command }`])
    }

    setCommand("")
  }

  return (
    <form onSubmit={ handleSubmit } className="flex items-center gap-2">
      <span className="select-none">$</span>
      <Input
        ref={inputElementRef}
        value={ command }
        onChange={ (e) => setCommand(e.target.value) }
        className={ "bg-transparent border-0 focus-visible:ring-0 px-0 py-1 h-auto" }
        placeholder="Enter command..."
        autoFocus
      />
    </form>
  );
}

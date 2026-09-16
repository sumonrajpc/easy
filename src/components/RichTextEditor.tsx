"use client";

import { useRef } from "react";
import { Bold, Italic, List, ListOrdered, Heading2, Link2, Underline } from "lucide-react";

export default function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    sync();
  }

  function sync() {
    if (inputRef.current && editorRef.current) {
      inputRef.current.value = editorRef.current.innerHTML;
    }
  }

  const buttons: { icon: typeof Bold; cmd: string; value?: string }[] = [
    { icon: Bold, cmd: "bold" },
    { icon: Italic, cmd: "italic" },
    { icon: Underline, cmd: "underline" },
    { icon: Heading2, cmd: "formatBlock", value: "h3" },
    { icon: List, cmd: "insertUnorderedList" },
    { icon: ListOrdered, cmd: "insertOrderedList" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-1.5">
        {buttons.map(({ icon: Icon, cmd, value }, i) => (
          <button
            key={i}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(cmd, value)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-brand-600"
          >
            <Icon size={15} />
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (url) exec("createLink", url);
          }}
          className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-brand-600"
        >
          <Link2 size={15} />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        className="prose prose-sm max-w-none min-h-[160px] px-4 py-3 text-sm text-slate-700 outline-none [&_h3]:font-bold [&_h3]:text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand-600 [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: defaultValue || "" }}
      />
      <input ref={inputRef} type="hidden" name={name} defaultValue={defaultValue || ""} />
    </div>
  );
}

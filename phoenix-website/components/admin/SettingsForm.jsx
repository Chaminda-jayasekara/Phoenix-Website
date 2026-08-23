"use client";

import { useFormState } from "react-dom";
import { updateSiteSettings } from "@/app/admin/actions";
import { Field, Input, Button, ErrorText } from "@/components/ui";

const textareaClass =
  "w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2.5 text-white text-sm outline-none";

export default function SettingsForm({ initial }) {
  const [state, formAction] = useFormState(updateSiteSettings, {});
  const eventDateValue = initial?.event_date ? toLocalInputValue(initial.event_date) : "";

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <Field label="Event date & time" hint="The homepage countdown counts down to this moment">
        <Input type="datetime-local" name="eventDate" defaultValue={eventDateValue} />
      </Field>
      <Field label="Homepage description">
        <textarea name="heroDescription" defaultValue={initial?.hero_description} className={textareaClass} rows={4} />
      </Field>
      <Field label="General rules video URL" hint="YouTube link, shown on the homepage">
        <Input name="generalRulesVideoUrl" defaultValue={initial?.general_rules_video_url} />
      </Field>
      <Field label="General rules PDF URL" hint="Direct link, or a Google Drive share link">
        <Input name="generalRulesPdfUrl" defaultValue={initial?.general_rules_pdf_url} />
      </Field>

      {state?.error && <ErrorText>{state.error}</ErrorText>}
      {state?.success && <div className="text-teal text-[12.5px] mt-1">Saved.</div>}
      <div className="mt-4">
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  );
}

function toLocalInputValue(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

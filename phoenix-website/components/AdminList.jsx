"use client";

import { useState } from "react";
import { Card, ReviewRow } from "@/components/ui";

export default function AdminList({ institutions }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === "all" ? institutions : institutions.filter((i) => i.type === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["all", "school", "university"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[12px] px-3 py-1.5 rounded-full border border-border font-semibold ${
              filter === f ? "bg-ember text-ink" : "text-muted"
            }`}
          >
            {f === "all" ? "All" : f === "school" ? "Schools" : "Universities"}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center text-muted text-sm">No registrations yet.</Card>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((inst) => {
          const bearers = inst.office_bearers || [];
          const getBearer = (role) => bearers.find((b) => b.role === role);
          return (
            <Card key={inst.id} className="p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(expanded === inst.id ? null : inst.id)}
              >
                <div>
                  <div className="font-bold text-[14.5px]">{inst.name}</div>
                  <div className="text-[11.5px] text-muted mt-0.5">
                    {inst.type === "school" ? "School" : "University"}
                    {inst.district ? ` · ${inst.district}` : ""} ·{" "}
                    {new Date(inst.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-muted text-lg">{expanded === inst.id ? "−" : "+"}</span>
              </div>
              {expanded === inst.id && (
                <div className="mt-3.5 border-t border-border pt-3.5">
                  <ReviewRow label="Email" value={inst.email} />
                  <ReviewRow label="Contact" value={inst.contact || "—"} />
                  <ReviewRow label="Address" value={`${inst.address}, ${inst.postal_code}`} />
                  <ReviewRow
                    label={inst.type === "university" ? "Sr. Treasurer/MIC" : "MIC"}
                    value={`${getBearer("mic")?.name || "—"} · ${getBearer("mic")?.contact || "—"}`}
                  />
                  <ReviewRow
                    label="President"
                    value={`${getBearer("president")?.name || "—"} · ${getBearer("president")?.contact || "—"}`}
                  />
                  <ReviewRow
                    label="Secretary"
                    value={`${getBearer("secretary")?.name || "—"} · ${getBearer("secretary")?.contact || "—"}`}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

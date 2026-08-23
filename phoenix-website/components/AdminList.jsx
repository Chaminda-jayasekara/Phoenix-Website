"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Card, ReviewRow } from "@/components/ui";

function exportInstitutions(list, label) {
  const rows = list.map((inst) => {
    const bearers = inst.office_bearers || [];
    const get = (role) => bearers.find((b) => b.role === role);
    return {
      Name: inst.name,
      Type: inst.type,
      Province: inst.province || "",
      District: inst.district || "",
      Email: inst.email,
      Contact: inst.contact || "",
      Address: inst.address,
      "Postal Code": inst.postal_code,
      "MIC Name": get("mic")?.name || "",
      "MIC Contact": get("mic")?.contact || "",
      "MIC Email": get("mic")?.email || "",
      "President Name": get("president")?.name || "",
      "President Contact": get("president")?.contact || "",
      "President Email": get("president")?.email || "",
      "Secretary Name": get("secretary")?.name || "",
      "Secretary Contact": get("secretary")?.contact || "",
      "Secretary Email": get("secretary")?.email || "",
      "Registered At": new Date(inst.created_at).toLocaleString(),
    };
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, label.slice(0, 31));
  XLSX.writeFile(wb, `phoenix-${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.xlsx`);
}

export default function AdminList({ institutions }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === "all" ? institutions : institutions.filter((i) => i.type === filter);
  const filterLabel = filter === "all" ? "All Institutions" : filter === "school" ? "Schools" : "Universities";

  return (
    <div>
      <div className="flex gap-2 mb-4 items-center flex-wrap">
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
        <button
          onClick={() => exportInstitutions(filtered, filterLabel)}
          disabled={filtered.length === 0}
          className="text-[12px] px-3 py-1.5 rounded-full border border-teal text-teal font-semibold ml-auto disabled:opacity-40"
        >
          ↓ Export Excel
        </button>
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

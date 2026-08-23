"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Card, ReviewRow } from "@/components/ui";

function exportContestants(list, label) {
  const rows = list.map((c) => ({
    Name: c.full_name,
    "Name with Initials": c.name_with_initials,
    Category: c.category,
    "Sub-category": c.sub_category || "",
    "Age category": c.age_category,
    Contact: c.contact,
    Email: c.email,
    Institution: c.institution_name || "",
    Group: c.is_group ? "Yes" : "No",
    "Team members": c.team_members || "",
    "Submission link": c.submission_link || "",
    "Registered At": new Date(c.created_at).toLocaleString(),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, label.slice(0, 31));
  XLSX.writeFile(wb, `phoenix-${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.xlsx`);
}

export default function AdminContestants({ contestants, categories }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === "all" ? contestants : contestants.filter((c) => c.category === filter);
  const filterLabel = filter === "all" ? "All Contestants" : categoryLabel(filter, categories);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")} label="All" />
        {categories.map((c) => (
          <FilterPill key={c.dbCategory} active={filter === c.dbCategory} onClick={() => setFilter(c.dbCategory)} label={c.label} />
        ))}
        <button
          onClick={() => exportContestants(filtered, filterLabel)}
          disabled={filtered.length === 0}
          className="text-[12px] px-3 py-1.5 rounded-full border border-teal text-teal font-semibold ml-auto disabled:opacity-40"
        >
          ↓ Export Excel
        </button>
      </div>

      {filtered.length === 0 && <Card className="text-center text-muted text-sm">No entries yet.</Card>}

      <div className="flex flex-col gap-3">
        {filtered.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
              <div>
                <div className="font-bold text-[14.5px]">
                  {c.full_name}
                  {c.is_group && <span className="text-flame2 text-[11px] font-semibold ml-2">GROUP</span>}
                </div>
                <div className="text-[11.5px] text-muted mt-0.5">
                  {categoryLabel(c.category, categories)} · {c.age_category}
                  {c.sub_category ? ` · ${c.sub_category}` : ""} · {new Date(c.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className="text-muted text-lg">{expanded === c.id ? "−" : "+"}</span>
            </div>
            {expanded === c.id && (
              <div className="mt-3.5 border-t border-border pt-3.5">
                <ReviewRow label="Name with initials" value={c.name_with_initials} />
                {c.is_group && c.team_members && <ReviewRow label="Team members" value={c.team_members} />}
                <ReviewRow label="Contact" value={c.contact} />
                <ReviewRow label="Email" value={c.email} />
                <ReviewRow label="Institution" value={c.institution_name || "—"} />
                {c.submission_link ? (
                  <ReviewRow
                    label="Submission"
                    value={
                      <a href={c.submission_link} className="text-teal break-all" target="_blank" rel="noreferrer">
                        {c.submission_link}
                      </a>
                    }
                  />
                ) : (
                  <ReviewRow label="Submission" value="— (no submission required for this category)" />
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function categoryLabel(dbCategory, categories) {
  return categories.find((c) => c.dbCategory === dbCategory)?.label || dbCategory;
}

function FilterPill({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`text-[12px] px-3 py-1.5 rounded-full border border-border font-semibold ${
        active ? "bg-ember text-ink" : "text-muted"
      }`}
    >
      {label}
    </button>
  );
}

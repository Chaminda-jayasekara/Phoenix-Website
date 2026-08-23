"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

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

export default function InstitutionsTable({ institutions }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let list = filter === "all" ? institutions : institutions.filter((i) => i.type === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.district || "").toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [institutions, filter, search]);

  const filterLabel = filter === "all" ? "All Institutions" : filter === "school" ? "Schools" : "Universities";

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
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
        <input
          placeholder="Search name, district, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-surfaceAlt border border-border rounded-lg px-3 py-1.5 text-[12.5px] outline-none flex-1 min-w-[160px] text-white"
        />
        <button
          onClick={() => exportInstitutions(filtered, filterLabel)}
          disabled={filtered.length === 0}
          className="text-[12px] px-3 py-1.5 rounded-full border border-teal text-teal font-semibold disabled:opacity-40 whitespace-nowrap"
        >
          ↓ Export Excel
        </button>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl">
        <table className="w-full text-[12.5px] border-collapse">
          <thead>
            <tr className="bg-surfaceAlt text-muted text-left">
              <th className="px-3 py-2.5 font-semibold">Name</th>
              <th className="px-3 py-2.5 font-semibold">Type</th>
              <th className="px-3 py-2.5 font-semibold">District</th>
              <th className="px-3 py-2.5 font-semibold">Contact</th>
              <th className="px-3 py-2.5 font-semibold">Email</th>
              <th className="px-3 py-2.5 font-semibold">Registered</th>
              <th className="px-3 py-2.5 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((inst) => (
              <InstitutionRow
                key={inst.id}
                inst={inst}
                expanded={expanded === inst.id}
                onToggle={() => setExpanded(expanded === inst.id ? null : inst.id)}
              />
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center text-muted text-sm py-8">No institutions match.</div>}
      </div>
    </div>
  );
}

function InstitutionRow({ inst, expanded, onToggle }) {
  const bearers = inst.office_bearers || [];
  const get = (role) => bearers.find((b) => b.role === role);
  return (
    <>
      <tr className="border-t border-border hover:bg-surfaceAlt/60 cursor-pointer" onClick={onToggle}>
        <td className="px-3 py-2.5 font-semibold">{inst.name}</td>
        <td className="px-3 py-2.5 capitalize">{inst.type}</td>
        <td className="px-3 py-2.5">{inst.district || "—"}</td>
        <td className="px-3 py-2.5">{inst.contact || "—"}</td>
        <td className="px-3 py-2.5">{inst.email}</td>
        <td className="px-3 py-2.5 text-muted whitespace-nowrap">{new Date(inst.created_at).toLocaleDateString()}</td>
        <td className="px-3 py-2.5 text-muted">{expanded ? "−" : "+"}</td>
      </tr>
      {expanded && (
        <tr className="border-t border-border bg-surfaceAlt/40">
          <td colSpan={7} className="px-3 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px]">
              <div>
                <span className="text-muted">Address: </span>
                {inst.address}, {inst.postal_code}
              </div>
              <div>
                <span className="text-muted">{inst.type === "university" ? "Sr. Treasurer/MIC" : "MIC"}: </span>
                {get("mic")?.name || "—"} · {get("mic")?.contact || "—"}
              </div>
              <div>
                <span className="text-muted">President: </span>
                {get("president")?.name || "—"} · {get("president")?.contact || "—"}
              </div>
              <div>
                <span className="text-muted">Secretary: </span>
                {get("secretary")?.name || "—"} · {get("secretary")?.contact || "—"}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

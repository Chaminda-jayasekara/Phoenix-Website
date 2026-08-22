"use client";

import { useState } from "react";
import AdminList from "@/components/AdminList";
import AdminContestants from "@/components/AdminContestants";

export default function AdminTabs({ institutions, contestants, categories }) {
  const [tab, setTab] = useState("institutions");

  return (
    <div>
      <div className="flex gap-2 mb-5 border-b border-border">
        <TabButton active={tab === "institutions"} onClick={() => setTab("institutions")}>
          Institutions ({institutions.length})
        </TabButton>
        <TabButton active={tab === "contestants"} onClick={() => setTab("contestants")}>
          Contestants ({contestants.length})
        </TabButton>
      </div>

      {tab === "institutions" ? (
        <AdminList institutions={institutions} />
      ) : (
        <AdminContestants contestants={contestants} categories={categories} />
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-[13px] font-semibold pb-2.5 px-1 -mb-px border-b-2 ${
        active ? "border-flame1 text-white" : "border-transparent text-muted"
      }`}
    >
      {children}
    </button>
  );
}

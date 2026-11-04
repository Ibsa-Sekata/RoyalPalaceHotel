import React from "react";
export default function StatCard({icon:Icon,label,value,change,sub="vs last month"}) {
 return <article className="stat-card"><div className="stat-top"><span className="stat-icon"><Icon size={18}/></span><span className="stat-change">↗ {change}</span></div><p>{label}</p><strong>{value}</strong><small>{sub}</small></article>;
}

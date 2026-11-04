import React from "react";
export default function AdminPageHeader({eyebrow="HOTEL OPERATIONS",title,description,action}) {
 return <div className="admin-page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

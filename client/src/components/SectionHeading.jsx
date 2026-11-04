import React from "react";
export default function SectionHeading({eyebrow="ROYAL PALACE", title, text, light=false}) {
 return <div className={`section-heading ${light?"light":""}`}><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}</div>;
}

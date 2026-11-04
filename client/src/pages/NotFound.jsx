import React from "react";
import { Link } from "react-router-dom";
export default function NotFound(){return <section className="not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>It seems you've taken a wrong turn.</h1><p>The page you are looking for is not available.</p><Link className="btn btn-gold" to="/">Return home</Link></section>}

import React, { useEffect, useState } from "react";
import { Mail, RotateCw, CheckCircle2, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { contactApi } from "../../api/contactApi.js";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [replying, setReplying] = useState(null);
  const [reply, setReply] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await contactApi.list();
      setMessages(res.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markResolved = async (id) => {
    setBusy(id);
    try { await contactApi.updateStatus(id, "RESOLVED"); await load(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  };
  const sendReply = async (id) => {
    if (!reply.trim()) return;
    setBusy(id);
    try { await contactApi.reply(id, reply); setReplying(null); setReply(""); await load(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  };

  const newCount = messages.filter(m => m.status === "NEW").length;

  return (
    <>
      <AdminPageHeader
        title="Contact messages"
        description="Messages submitted through the public contact form."
        action={
          <button className="btn btn-light" onClick={load}>
            <RotateCw size={15}/> Refresh
          </button>
        }
      />
      {error && <p style={{ color: "#c05d5d" }}>{error}</p>}

      <div className="stat-grid compact-stats">
        <div className="stat-card"><p>Total messages</p><strong>{messages.length}</strong></div>
        <div className="stat-card"><p>New (unread)</p><strong>{newCount}</strong></div>
        <div className="stat-card"><p>Resolved</p><strong>{messages.filter(m => m.status === "RESOLVED").length}</strong></div>
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>From</th><th>Email</th><th>Subject</th><th>Message</th><th>Reply</th>
                <th>Status</th><th>Received</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="8" className="empty-state">Loading…</td></tr>
                : messages.length === 0 ? <tr><td colSpan="8" className="empty-state">No messages yet.</td></tr>
                : messages.map(m => (
                  <React.Fragment key={m.id}>
                  <tr>
                    <td>{m.fullName}</td>
                    <td>{m.email}</td>
                    <td>{m.subject}</td>
                    <td style={{maxWidth: 300, whiteSpace: "normal"}}>{m.message}</td>
                    <td style={{maxWidth: 260, whiteSpace: "normal"}}>{m.reply || "—"}</td>
                    <td>
                      <span className={`status status-${m.status.toLowerCase()}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-small btn-gold" onClick={() => {setReplying(m.id);setReply(m.reply || "")}}>Reply</button>{" "}
                      {m.status === "NEW" && <button className="btn btn-small btn-light" disabled={busy === m.id} onClick={() => markResolved(m.id)}>{busy === m.id ? "…" : "Resolve"}</button>}
                    </td>
                  </tr>
                  {replying === m.id && <tr key={`${m.id}-reply`}><td colSpan="8"><form onSubmit={e=>{e.preventDefault();sendReply(m.id)}} className="inline-reply"><textarea autoFocus value={reply} onChange={e=>setReply(e.target.value)} placeholder={`Reply to ${m.fullName}…`} required/><button className="btn btn-gold" disabled={busy===m.id}>Send reply</button><button type="button" className="btn btn-light" onClick={()=>setReplying(null)}>Cancel</button></form></td></tr>}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

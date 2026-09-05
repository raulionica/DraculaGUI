import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { requireLicenseKey } from '../core/license';

const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

function chatFrame() {
  return document.querySelector('iframe[name="chat"], iframe#chat');
}

function latestQuestion(doc) {
  let latest = null;
  for (const node of doc.querySelectorAll('#chatList div[id^="ajaxChat_m_"]')) {
    const text = (node.innerText || '').replace(/^\s*\(\d{2}:\d{2}:\d{2}\)\s*/, '').trim();
    const clean = normalize(text);
    if (/^(intrebare|question):/.test(clean)) {
      latest = { id: node.id, question: text.slice(text.indexOf(':') + 1).trim(), closed: false };
    } else if (latest && /^(raspuns|answer|raspunsul corect|the correct answer):/.test(clean)) {
      latest.closed = true;
      latest.official = text.slice(text.indexOf(':') + 1).split(/\.\s|Bravo/)[0].trim();
    }
  }
  return latest;
}

function arithmetic(question) {
  const match = normalize(question).match(/^(?:cat fac|cat face|what is)\s+(\d+)\s*([+*x/-])\s*(\d+)\s*\??$/);
  if (!match) return '';
  const a = Number(match[1]), b = Number(match[3]);
  const value = { '+': () => a + b, '-': () => a - b, '*': () => a * b, x: () => a * b, '/': () => a / b }[match[2]]();
  return Number.isSafeInteger(value) ? String(value) : '';
}

export default function QuizCard() {
  const [current, setCurrent] = useState(null);
  const [answer, setAnswer] = useState('');
  const [database, setDatabase] = useState(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mount, setMount] = useState(null);
  const questionRef = useRef(null);
  const sentRef = useRef(null);

  useEffect(() => {
    const container = document.createElement('div');
    container.id = 'dracula-quiz-card';
    container.style.cssText = 'width:100%;clear:both;box-sizing:border-box;margin-bottom:8px;';
    const attach = () => {
      const sidebar = document.querySelector('#bloclangaporumbel');
      if (sidebar && container.parentElement !== sidebar) {
        sidebar.prepend(container);
        setMount(container);
      }
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); container.remove(); };
  }, []);

  useEffect(() => {
    const read = () => {
      try {
        const frame = chatFrame();
        const doc = frame?.contentDocument;
        if (!doc?.querySelector('#chatList')) { setCurrent(null); return; }
        const next = latestQuestion(doc);
        if (!next) { setCurrent(null); return; }
        if (questionRef.current !== next.id) {
          questionRef.current = next.id;
          setAnswer(next.official || arithmetic(next.question) || database?.get(normalize(next.question)) || '');
          setMessage('');
        }
        setCurrent(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
      } catch { setCurrent(null); }
    };
    read();
    const timer = setInterval(read, 500);
    return () => clearInterval(timer);
  }, [database]);

  const loadDatabase = useCallback(async () => {
    const key = requireLicenseKey();
    if (!key) return;
    setLoading(true);
    try {
      const response = await fetch('https://dracula-attack.thoe2dev.workers.dev/quiz.json', { headers: { Authorization: `Bearer ${key}` } });
      if (!response.ok) throw new Error(response.status === 403 ? 'Licență invalidă.' : 'Baza nu este disponibilă.');
      const rows = await response.json();
      const lookup = new Map(rows.map(row => [normalize(row.question), String(row.answer)]));
      setDatabase(lookup);
      const live = latestQuestion(chatFrame().contentDocument);
      if (live && !live.closed) setAnswer(arithmetic(live.question) || lookup.get(normalize(live.question)) || '');
      setMessage('Baza de răspunsuri este încărcată.');
    } catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem('dracula_license_key')) {
        const timer = setTimeout(loadDatabase, 0);
        return () => clearTimeout(timer);
      }
    } catch { /* Manual loading remains available. */ }
  }, [loadDatabase]);

  const send = () => {
    try {
      const doc = chatFrame()?.contentDocument;
      const live = doc && latestQuestion(doc);
      if (!live || live.closed || live.id !== current?.id || sentRef.current === live.id || !answer.trim()) return;
      const field = doc.querySelector('#inputField');
      if (!field || field.value.trim()) throw new Error('Golește mesajul existent din chat înainte de trimitere.');
      const submit = doc.querySelector('#submitButton');
      if (!submit) throw new Error('Butonul de trimitere al chatului nu a fost găsit.');
      field.value = answer.trim();
      field.dispatchEvent(new doc.defaultView.Event('input', { bubbles: true }));
      sentRef.current = live.id;
      setSent(live.id);
      submit.click();
      setMessage('Răspuns trimis. Aștept rezultatul din chat.');
    } catch (error) { setMessage(error.message); }
  };

  if (!mount) return null;
  return createPortal(<Box sx={{ width: '100%', boxSizing: 'border-box', p: 1.5, color: '#fff', background: 'rgba(15,22,14,.95)', border: '1px solid #bfa45b', borderRadius: 2 }}>
    <Typography sx={{ color: '#e5c07b', fontWeight: 800 }}>{current?.closed ? 'Ultima întrebare' : 'Întrebarea din chat'}</Typography>
    <Typography sx={{ my: 1, fontSize: 13 }}>I: {current?.question || 'Aștept o întrebare…'}</Typography>
    <TextField size="small" fullWidth label="R:" value={current?.closed ? current.official || answer : answer} onChange={event => setAnswer(event.target.value)} disabled={!current || current.closed || sent === current.id} sx={{ my: 1, '& input': { color: '#fff' }, '& label': { color: '#ccc' } }} />
    <Button fullWidth variant="contained" onClick={send} disabled={!current || current.closed || sent === current.id || !answer.trim()}>{current?.closed ? 'Întrebare încheiată' : sent === current?.id ? 'Trimis' : 'Răspunde'}</Button>
    {!database && <Button fullWidth disabled={loading} onClick={loadDatabase}>{loading ? 'Se încarcă…' : 'Încarcă răspunsurile'}</Button>}
    {message && <Typography role="status" sx={{ mt: 1, fontSize: 12 }}>{message}</Typography>}
  </Box>, mount);
}

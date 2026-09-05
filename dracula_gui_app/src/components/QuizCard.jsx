import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { requireLicenseKey } from '../core/license';
import IconThoe2 from './custom-icons';

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
  const match = normalize(question).match(/^(?:(?:cat fac|cat face|what is)\s+)?(\d+)\s*([+*x×÷/-])\s*(\d+)\s*[?=]?$/);
  if (!match) return '';
  const a = Number(match[1]), b = Number(match[3]);
  const value = { '+': () => a + b, '-': () => a - b, '*': () => a * b, x: () => a * b, '×': () => a * b, '÷': () => a / b, '/': () => a / b }[match[2]]();
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
    const attach = () => {
      const chat = document.querySelector('#blocporumbel');
      const row = document.querySelector('#blocd');
      if (!chat || !row) return;
      const hasLeftSpace = chat.getBoundingClientRect().left >= 240;
      const parent = hasLeftSpace ? chat : row.parentElement;
      const css = hasLeftSpace
        ? 'position:absolute;right:calc(100% + 12px);top:0;width:220px;box-sizing:border-box;z-index:50;'
        : 'position:relative;width:220px;max-width:100%;box-sizing:border-box;margin:8px 0;clear:both;';
      if (container.style.cssText !== css) container.style.cssText = css;
      if (container.parentElement !== parent) {
        if (hasLeftSpace) chat.appendChild(container);
        else parent.insertBefore(container, row);
        setMount(container);
      }
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', attach);
    return () => { observer.disconnect(); window.removeEventListener('resize', attach); container.remove(); };
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
      setMessage('');
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
  return createPortal(<Box sx={{ width: '100%', boxSizing: 'border-box', p: 2, color: '#fff', fontFamily: 'Arial, sans-serif', background: 'linear-gradient(145deg, rgba(37,40,34,.88), rgba(18,22,18,.94))', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,.3)', borderRadius: '22px', boxShadow: '0 18px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.08)' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <IconThoe2 icon="ui:parliament" sx={{ color: '#e5c07b', fontSize: 23 }} />
      <Typography sx={{ color: '#e5c07b', fontWeight: 800, fontSize: 14 }}>{current?.closed ? 'Ultima întrebare' : 'Întrebarea din chat'}</Typography>
    </Box>
    <Box sx={{ p: 1.25, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '13px' }}>
      <Typography sx={{ color: 'rgba(255,255,255,.55)', fontSize: 10, fontWeight: 700, mb: .5 }}>ÎNTREBARE</Typography>
      <Typography sx={{ fontSize: 13, lineHeight: 1.5, overflowWrap: 'anywhere' }}>{current?.question || 'Aștept o întrebare…'}</Typography>
    </Box>
    <Typography sx={{ mt: 1.5, mb: .75, color: 'rgba(255,255,255,.6)', fontSize: 10, fontWeight: 700 }}>RĂSPUNS</Typography>
    <TextField size="small" fullWidth placeholder="Introdu răspunsul" value={current?.closed ? current.official || answer : answer} onChange={event => setAnswer(event.target.value)} inputProps={{ 'aria-label': 'Răspuns' }} InputProps={{ readOnly: !current || current.closed || sent === current.id }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 15, fontWeight: 700 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,.18)' }, '& input': { color: '#fff', WebkitTextFillColor: '#fff' } }} />
    <Button fullWidth variant="outlined" startIcon={<IconThoe2 icon="inventory:sword" sx={{ fontSize: 18 }} />} onClick={send} disabled={!current || current.closed || sent === current.id || !answer.trim()} sx={{ mt: 1.5, py: 1, borderRadius: '12px', color: '#00b6ec', borderColor: 'rgba(0,182,236,.5)', fontWeight: 700, textTransform: 'none', background: 'rgba(0,182,236,.04)', '&:hover': { background: 'rgba(0,182,236,.12)', borderColor: '#00b6ec' }, '&.Mui-disabled': { color: 'rgba(255,255,255,.5)', borderColor: 'rgba(255,255,255,.12)' } }}>Răspunde</Button>
    {(current?.closed || sent === current?.id) && <Typography sx={{ mt: 1, fontSize: 11, color: '#c7bea4', textAlign: 'center' }}>{current?.closed ? 'Întrebare încheiată' : 'Răspuns trimis'}</Typography>}
    {!database && <Button fullWidth disabled={loading} onClick={loadDatabase} sx={{ mt: 1, fontSize: 11, color: '#e5c07b', textTransform: 'none' }}>{loading ? 'Se încarcă…' : 'Încarcă răspunsurile'}</Button>}
    {message && <Typography role="status" sx={{ mt: 1, fontSize: 11, lineHeight: 1.4, color: '#9bdeed' }}>{message}</Typography>}
  </Box>, mount);
}

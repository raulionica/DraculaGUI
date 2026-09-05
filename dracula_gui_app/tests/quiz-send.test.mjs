import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = readFileSync(new URL('../src/components/QuizCard.jsx', import.meta.url), 'utf8');
const helpers = source.slice(source.indexOf('const normalize'), source.indexOf('export default'));
const sendBody = source.slice(source.indexOf('  const send = useCallback('), source.indexOf('\n  useEffect(() => {\n    if (!automatic'));
function fixture({ closed = false, draft = '', stored = null, changed = false } = {}) {
  let clicks = 0;
  const field = { value: draft, dispatchEvent() {} };
  const nodes = [{ id: 'ajaxChat_m_10', innerText: `Intrebare: ${changed ? '2+3' : '6*6'}` }];
  if (closed) nodes.push({ id: 'ajaxChat_m_11', innerText: 'Raspuns: 36. Bravo!' });
  const doc = {
    querySelectorAll: () => nodes,
    querySelector: selector => selector === '#inputField' ? field : { click() { clicks++; } },
    defaultView: { Event: class {} },
  };
  const context = {
    document: { querySelector: () => ({ contentDocument: doc }) },
    answer: '36', current: { id: 'ajaxChat_m_10', question: '6*6' },
    sentRef: { current: null }, setSent() {}, setMessage() {},
    sessionStorage: { getItem: () => stored, setItem: (_, value) => { stored = value; } },
    useCallback: fn => fn,
  };
  const send = runInNewContext(`${helpers}\n${sendBody}\nsend`, context);
  return { send, field, clicks: () => clicks };
}
test('sends once, preserving numeric answer text', () => {
  const f = fixture(); f.send(); f.send();
  assert.equal(f.clicks(), 1); assert.equal(f.field.value, '36');
});
for (const [name, options] of Object.entries({
  closed: { closed: true }, changed: { changed: true }, draft: { draft: 'hello' },
  restored: { stored: JSON.stringify(['ajaxChat_m_10', '6*6']) },
})) test(`does not send when ${name}`, () => {
  const f = fixture(options); f.send(); assert.equal(f.clicks(), 0);
});
test('arithmetic uses no database or eval', () => {
  const calculate = runInNewContext(`${helpers}\narithmetic`);
  for (const [question, expected] of [['Cat fac 6*6?', '36'], ['2+3', '5'], ['634+83', '717'], ['6×6', '36'], ['1/0', ''], ['Cine a inventat becul?', '']]) {
    assert.equal(calculate(question), expected);
  }
});

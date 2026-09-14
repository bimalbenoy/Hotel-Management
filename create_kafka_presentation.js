const pptxgen = require(process.env.PPTXGENJS_PATH || 'pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Hostel Management Engineering';
pptx.subject = 'Kafka architecture and observability';
pptx.title = 'Event-Driven Hostel Management';
pptx.company = 'Hostel Management';
pptx.lang = 'en-US';
pptx.theme = {
  headFontFace: 'Aptos Display',
  bodyFontFace: 'Aptos',
  lang: 'en-US'
};
pptx.defineSlideMaster({
  title: 'MASTER',
  background: { color: '0B1220' },
  objects: [
    { line: { x: 0.42, y: 7.08, w: 12.45, h: 0, line: { color: '243247', width: 1 } } },
    { text: { text: 'HOSTEL MANAGEMENT  /  EVENT-DRIVEN FLOW', options: { x: 0.48, y: 7.16, w: 5.8, h: 0.18, fontFace: 'Aptos', fontSize: 7, color: '708198', charSpacing: 1.2, margin: 0 } } },
    { text: { text: '2026', options: { x: 12.15, y: 7.16, w: 0.65, h: 0.18, fontFace: 'Aptos', fontSize: 7, color: '708198', align: 'right', margin: 0 } } }
  ],
  slideNumber: { x: 12.88, y: 7.13, color: '708198', fontFace: 'Aptos', fontSize: 7 }
});

const C = {
  bg: '0B1220', panel: '121D2D', panel2: '17263A', ink: 'F4F7FB', muted: 'A4B2C5', line: '31445E', teal: '42D6C5', cyan: '54B7FF', orange: 'FFB454', red: 'FF6B76', green: '6FE0A1', purple: 'A98BFF', white: 'FFFFFF', black: '0B1220'
};
const S = pptx.ShapeType;

function tx(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, { x, y, w, h, fontFace: opts.fontFace || 'Aptos', fontSize: opts.fontSize || 14, color: opts.color || C.ink, bold: opts.bold || false, margin: opts.margin === undefined ? 0 : opts.margin, breakLine: false, fit: 'shrink', valign: opts.valign || 'mid', align: opts.align || 'left', italic: opts.italic || false, charSpacing: opts.charSpacing || 0, bullet: opts.bullet, paraSpaceAfterPt: opts.paraSpaceAfterPt || 0, transparency: opts.transparency });
}
function box(slide, x, y, w, h, fill, line = fill, radius = 0.12) {
  slide.addShape(S.roundRect, { x, y, w, h, rectRadius: radius, fill: { color: fill }, line: { color: line, width: 1 } });
}
function line(slide, x1, y1, x2, y2, color = C.line, width = 1.5, end = 'none') {
  slide.addShape(S.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width, endArrowType: end } });
}
function dot(slide, x, y, r, color) {
  slide.addShape(S.ellipse, { x, y, w: r, h: r, fill: { color }, line: { color } });
}
function title(slide, kicker, heading, sub = '') {
  tx(slide, kicker.toUpperCase(), 0.55, 0.36, 3.6, 0.24, { fontSize: 9, color: C.teal, bold: true, charSpacing: 1.6 });
  tx(slide, heading, 0.52, 0.68, 11.8, 0.55, { fontSize: 27, bold: true, color: C.ink });
  if (sub) tx(slide, sub, 0.55, 1.27, 11.7, 0.33, { fontSize: 11, color: C.muted });
}
function pill(slide, text, x, y, w, color, fill = C.panel2) {
  box(slide, x, y, w, 0.3, fill, color, 0.15);
  tx(slide, text, x, y + 0.01, w, 0.25, { fontSize: 8, color, bold: true, align: 'center', charSpacing: 0.8 });
}
function service(slide, x, y, w, h, name, sub, color) {
  box(slide, x, y, w, h, C.panel, color);
  slide.addShape(S.rect, { x, y, w: 0.08, h, fill: { color }, line: { color } });
  tx(slide, name, x + 0.22, y + 0.18, w - 0.3, 0.28, { fontSize: 16, bold: true });
  tx(slide, sub, x + 0.22, y + 0.53, w - 0.3, 0.25, { fontSize: 9, color: C.muted });
}
function topic(slide, x, y, label, color) {
  box(slide, x, y, 1.72, 0.72, color, color);
  tx(slide, 'KAFKA TOPIC', x + 0.12, y + 0.1, 1.48, 0.15, { fontSize: 7, color: C.black, bold: true, align: 'center', charSpacing: 1 });
  tx(slide, label, x + 0.1, y + 0.31, 1.52, 0.22, { fontSize: 12, color: C.black, bold: true, align: 'center' });
}
function note(slide, text, x, y, w, color = C.orange) {
  slide.addShape(S.line, { x, y: y + 0.08, w: 0, h: 0.35, line: { color, width: 3 } });
  tx(slide, text, x + 0.12, y, w - 0.12, 0.54, { fontSize: 10, color: C.muted, valign: 'top' });
}
function metric(slide, x, y, w, label, value, color) {
  box(slide, x, y, w, 0.76, C.panel, C.line);
  tx(slide, value, x + 0.16, y + 0.12, w - 0.3, 0.28, { fontSize: 19, bold: true, color });
  tx(slide, label, x + 0.16, y + 0.48, w - 0.3, 0.16, { fontSize: 8, color: C.muted });
}

// 1
{
  const s = pptx.addSlide('MASTER');
  s.background = { color: C.bg };
  s.addShape(S.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.bg }, line: { color: C.bg } });
  s.addShape(S.arc, { x: 8.7, y: -1.15, w: 5.3, h: 5.3, adjustPoint: 0.25, line: { color: C.teal, transparency: 65, width: 1.5 } });
  s.addShape(S.arc, { x: 9.2, y: -0.65, w: 4.3, h: 4.3, adjustPoint: 0.25, line: { color: C.cyan, transparency: 70, width: 1 } });
  pill(s, 'ARCHITECTURE REVIEW', 0.66, 0.74, 1.9, C.teal);
  tx(s, 'Event-driven\nhostel management', 0.65, 1.55, 7.8, 1.45, { fontSize: 33, bold: true, color: C.white, valign: 'top' });
  tx(s, 'Kafka flow  /  failure handling  /  Grafana  /  cache-aside', 0.7, 3.38, 7.4, 0.35, { fontSize: 14, color: C.muted });
  line(s, 0.7, 4.1, 6.7, 4.1, C.teal, 2);
  tx(s, 'A visual walkthrough of how a booking becomes a payment result,\nhow failures are retained or retried, and where we observe the system.', 0.7, 4.35, 6.3, 0.68, { fontSize: 14, color: C.ink, valign: 'top' });
  service(s, 8.15, 4.65, 1.35, 0.95, 'BOOKING', 'producer', C.teal);
  topic(s, 9.88, 4.76, 'booking.created', C.orange);
  service(s, 11.86, 4.65, 1.15, 0.95, 'PAYMENT', 'consumer', C.cyan);
  line(s, 9.52, 5.13, 9.85, 5.13, C.orange, 2, 'triangle');
  tx(s, 'prepared for presentation', 0.7, 6.45, 3.5, 0.2, { fontSize: 9, color: C.teal, charSpacing: 1 });
}

// 2
{
  const s = pptx.addSlide('MASTER');
  title(s, '01 / System map', 'Three services, two topics, one business journey', 'Each consumer group gets its own copy of the payment result.');
  service(s, 0.65, 2.1, 2.25, 1.12, 'Booking Service', 'creates booking + event', C.teal);
  topic(s, 3.55, 2.3, 'booking.created', C.orange);
  service(s, 6.0, 2.1, 2.25, 1.12, 'Payment Service', 'charges wallet', C.cyan);
  topic(s, 8.9, 2.3, 'payment.result', C.purple);
  service(s, 11.35, 1.48, 1.35, 1.12, 'Booking', 'status', C.teal);
  service(s, 11.35, 3.05, 1.35, 1.12, 'Notify', 'email', C.orange);
  line(s, 2.91, 2.66, 3.5, 2.66, C.orange, 2.4, 'triangle');
  line(s, 5.3, 2.66, 5.95, 2.66, C.orange, 2.4, 'triangle');
  line(s, 8.28, 2.66, 8.85, 2.66, C.purple, 2.4, 'triangle');
  line(s, 10.65, 2.66, 11.28, 2.0, C.teal, 2.1, 'triangle');
  line(s, 10.65, 2.66, 11.28, 3.6, C.orange, 2.1, 'triangle');
  pill(s, 'payment-group', 6.3, 3.55, 1.65, C.cyan);
  pill(s, 'booking-group', 10.95, 4.65, 1.6, C.teal);
  pill(s, 'notification-group', 10.65, 5.05, 1.9, C.orange);
  note(s, 'Kafka preserves ordering inside a partition. The message key is the booking ID, so related events can stay together.', 0.72, 4.55, 4.3, C.teal);
  note(s, 'The same payment.result is delivered independently to Booking and Notification because they use different consumer groups.', 5.2, 4.55, 4.55, C.purple);
  box(s, 10.25, 5.75, 2.35, 0.55, C.panel2, C.line);
  tx(s, 'fan-out by consumer group', 10.4, 5.9, 2.05, 0.2, { fontSize: 10, color: C.ink, bold: true, align: 'center' });
}

// 3
{
  const s = pptx.addSlide('MASTER');
  title(s, '02 / Event flow', 'From HTTP request to confirmed booking', 'The flow separates the user-facing write from downstream payment and notification work.');
  const xs = [1.05, 3.55, 6.05, 8.55, 11.05];
  const labels = ['Client', 'Booking', 'Kafka', 'Payment', 'Booking +\nNotify'];
  const colors = [C.white, C.teal, C.orange, C.cyan, C.purple];
  xs.forEach((x, i) => {
    dot(s, x + 0.27, 1.95, 0.22, colors[i]);
    tx(s, labels[i], x - 0.1, 2.28, 0.9, 0.42, { fontSize: 10, color: colors[i], bold: true, align: 'center', valign: 'top' });
    line(s, x + 0.38, 2.75, x + 0.38, 6.15, C.line, 1);
  });
  const events = [
    [1.43, 3.15, 'POST /bookings', C.white],
    [3.93, 3.78, 'DB transaction\nbooking + outbox row', C.teal],
    [6.43, 4.42, 'booking.created', C.orange],
    [8.93, 5.0, 'wallet debit\nSUCCESS / FAILED', C.cyan],
    [11.43, 5.58, 'payment.result\nstatus update + email', C.purple]
  ];
  events.forEach(([x, y, text, color]) => {
    box(s, x - 0.45, y, 1.55, 0.58, C.panel, color);
    tx(s, text, x - 0.32, y + 0.1, 1.3, 0.38, { fontSize: 9, color: C.ink, align: 'center' });
  });
  line(s, 1.43, 3.44, 3.93, 4.06, C.white, 1.8, 'triangle');
  line(s, 3.93, 4.36, 6.43, 4.7, C.teal, 1.8, 'triangle');
  line(s, 6.43, 4.99, 8.93, 5.28, C.orange, 1.8, 'triangle');
  line(s, 8.93, 5.57, 11.43, 5.86, C.cyan, 1.8, 'triangle');
  tx(s, 'The user gets a booking response after the local transaction. Kafka continues the journey asynchronously.', 1.0, 6.45, 11.2, 0.25, { fontSize: 11, color: C.muted, align: 'center' });
}

// 4
{
  const s = pptx.addSlide('MASTER');
  title(s, '03 / Reliability boundary', 'The outbox closes the database-to-Kafka gap', 'Booking and its event are committed together; publishing can safely happen later.');
  box(s, 0.72, 1.8, 4.2, 3.9, C.panel, C.teal);
  tx(s, 'ONE DATABASE TRANSACTION', 1.0, 2.08, 3.6, 0.25, { fontSize: 10, color: C.teal, bold: true, charSpacing: 1.2, align: 'center' });
  box(s, 1.28, 2.75, 3.08, 0.75, C.panel2, C.line);
  tx(s, 'booking row', 1.45, 2.92, 2.75, 0.24, { fontSize: 16, bold: true, align: 'center' });
  box(s, 1.28, 4.0, 3.08, 0.75, C.panel2, C.orange);
  tx(s, 'outbox event  /  PENDING', 1.45, 4.17, 2.75, 0.24, { fontSize: 14, bold: true, color: C.orange, align: 'center' });
  line(s, 2.82, 3.52, 2.82, 3.94, C.teal, 2, 'triangle');
  tx(s, 'commit or rollback together', 1.2, 5.07, 3.25, 0.2, { fontSize: 10, color: C.muted, align: 'center' });
  line(s, 4.95, 3.73, 6.25, 3.73, C.orange, 2.2, 'triangle');
  box(s, 6.3, 2.3, 2.3, 2.85, C.panel, C.orange);
  tx(s, 'OUTBOX WORKER', 6.57, 2.62, 1.75, 0.2, { fontSize: 10, color: C.orange, bold: true, align: 'center', charSpacing: 1 });
  tx(s, 'poll\n→ publish\n→ mark published', 6.75, 3.12, 1.4, 1.2, { fontSize: 17, bold: true, align: 'center', valign: 'mid' });
  pill(s, 'every 5 seconds', 6.57, 4.55, 1.75, C.orange);
  line(s, 8.62, 3.73, 9.82, 3.73, C.orange, 2.2, 'triangle');
  box(s, 9.88, 2.3, 2.65, 2.85, C.panel, C.cyan);
  tx(s, 'KAFKA', 10.42, 2.62, 1.55, 0.2, { fontSize: 10, color: C.cyan, bold: true, align: 'center', charSpacing: 1 });
  tx(s, 'booking.created', 10.15, 3.25, 2.1, 0.28, { fontSize: 17, bold: true, color: C.ink, align: 'center' });
  tx(s, 'retryable delivery', 10.25, 4.0, 1.9, 0.2, { fontSize: 10, color: C.muted, align: 'center' });
  note(s, 'Failure mode: Kafka down means the row stays PENDING and is retried later. The booking itself is not lost.', 0.9, 6.05, 5.2, C.green);
  note(s, 'Current implementation marks failed attempts back to PENDING and increments attempts. Add a cap/DLQ policy before production.', 6.45, 6.05, 5.9, C.orange);
}

// 5
{
  const s = pptx.addSlide('MASTER');
  title(s, '04 / Exception handling', 'Two different failures, two different recovery paths', 'The key presentation point is where the handler throws and where the event remains recoverable.');
  box(s, 0.7, 1.78, 5.75, 4.5, C.panel, C.cyan);
  tx(s, 'PAYMENT CONSUMER', 1.0, 2.05, 2.5, 0.24, { fontSize: 11, color: C.cyan, bold: true, charSpacing: 1.2 });
  const left = [
    ['1', 'parse booking event', C.white],
    ['2', 'create payment / debit wallet', C.cyan],
    ['3', 'publish payment.result', C.orange],
    ['4', 'increment consumed metric', C.green]
  ];
  left.forEach((r, i) => {
    const y = 2.65 + i * 0.72;
    dot(s, 1.05, y + 0.08, 0.26, r[2]);
    tx(s, r[0], 1.05, y + 0.09, 0.26, 0.18, { fontSize: 9, color: C.black, bold: true, align: 'center' });
    tx(s, r[1], 1.52, y, 3.9, 0.38, { fontSize: 14, bold: true });
    if (i < left.length - 1) line(s, 1.18, y + 0.36, 1.18, y + 0.7, C.line, 1.2, 'triangle');
  });
  box(s, 1.0, 5.58, 4.85, 0.42, '253B42', C.green);
  tx(s, 'success: offset can commit after full handler', 1.2, 5.68, 4.45, 0.18, { fontSize: 10, color: C.green, bold: true, align: 'center' });
  box(s, 6.9, 1.78, 5.75, 4.5, C.panel, C.red);
  tx(s, 'FAILURE BRANCH', 7.2, 2.05, 2.5, 0.24, { fontSize: 11, color: C.red, bold: true, charSpacing: 1.2 });
  tx(s, 'processing error', 7.35, 2.72, 1.9, 0.25, { fontSize: 15, bold: true });
  line(s, 9.38, 2.85, 10.1, 2.85, C.red, 2, 'triangle');
  box(s, 10.18, 2.5, 1.85, 0.72, C.panel2, C.orange);
  tx(s, 'publish FAILED', 10.32, 2.72, 1.55, 0.2, { fontSize: 13, color: C.orange, bold: true, align: 'center' });
  line(s, 11.1, 3.28, 11.1, 3.78, C.red, 2, 'triangle');
  box(s, 9.7, 3.86, 2.65, 0.72, C.panel2, C.red);
  tx(s, 'publish fails?', 9.92, 4.08, 2.2, 0.2, { fontSize: 13, color: C.red, bold: true, align: 'center' });
  line(s, 10.98, 4.6, 10.98, 5.05, C.red, 2, 'triangle');
  box(s, 7.45, 5.1, 4.55, 0.72, '3D2028', C.red);
  tx(s, 'throw → Kafka retries / offset remains', 7.7, 5.32, 4.05, 0.2, { fontSize: 13, color: C.red, bold: true, align: 'center' });
  tx(s, 'Notification follows the same principle: email failure is rethrown so the message is not silently acknowledged.', 0.85, 6.53, 11.8, 0.22, { fontSize: 10, color: C.muted, align: 'center' });
}

// 6
{
  const s = pptx.addSlide('MASTER');
  title(s, '05 / Retry model', 'Retry is useful only when the next attempt can succeed', 'There are three layers: producer retry, outbox retry, and consumer redelivery.');
  const cols = [0.7, 4.45, 8.2];
  const headings = ['Producer retry', 'Outbox retry', 'Consumer redelivery'];
  const colors = [C.orange, C.teal, C.cyan];
  const bodies = [
    ['KafkaJS producer', '5 attempts', '5 second delay', 'idempotent producer enabled'],
    ['PENDING row', 'batch of 10', 'poll every 5 seconds', 'mark PUBLISHED after send'],
    ['handler throws', 'offset not completed', 'Kafka retries on restart', 'failed metric increments']
  ];
  cols.forEach((x, i) => {
    box(s, x, 2.0, 3.0, 3.75, C.panel, colors[i]);
    tx(s, headings[i], x + 0.23, 2.3, 2.55, 0.28, { fontSize: 16, bold: true, color: colors[i], align: 'center' });
    bodies[i].forEach((t, j) => {
      const y = 3.0 + j * 0.55;
      dot(s, x + 0.32, y + 0.08, 0.12, colors[i]);
      tx(s, t, x + 0.58, y, 2.05, 0.28, { fontSize: 11, color: j === 0 ? C.ink : C.muted, bold: j === 0 });
    });
  });
  line(s, 3.73, 3.87, 4.35, 3.87, C.line, 2, 'triangle');
  line(s, 7.48, 3.87, 8.1, 3.87, C.line, 2, 'triangle');
  box(s, 1.1, 6.2, 11.0, 0.5, '332B20', C.orange);
  tx(s, 'Design question to answer in the room: what stops a permanent poison message from retrying forever?', 1.3, 6.34, 10.6, 0.2, { fontSize: 11, color: C.orange, bold: true, align: 'center' });
}

// 7
{
  const s = pptx.addSlide('MASTER');
  title(s, '06 / Current implementation notes', 'What is already strong, and what to call out honestly', 'These are presentation talking points, not hidden surprises.');
  const rows = [
    ['GOOD', 'Outbox transaction', 'booking + event are committed together', C.green],
    ['GOOD', 'Idempotent producer', 'reduces duplicate sends on ambiguous retries', C.green],
    ['GOOD', 'Throw on downstream failure', 'keeps the source event recoverable', C.green],
    ['WATCH', 'Test throw remains in Payment consumer', 'remove or gate TEST KAFKA FAILURE before live demo', C.red],
    ['WATCH', 'No DLQ / retry cap yet', 'a poison message can keep failing', C.orange],
    ['WATCH', 'Consumer uses any payload', 'schema validation would make contracts safer', C.orange]
  ];
  rows.forEach((r, i) => {
    const y = 1.85 + i * 0.72;
    box(s, 0.72, y, 1.0, 0.45, r[3], r[3]);
    tx(s, r[0], 0.72, y + 0.11, 1.0, 0.18, { fontSize: 8, color: C.black, bold: true, align: 'center', charSpacing: 1 });
    tx(s, r[1], 2.05, y + 0.04, 3.15, 0.25, { fontSize: 14, bold: true });
    tx(s, r[2], 5.42, y + 0.05, 6.7, 0.25, { fontSize: 11, color: C.muted });
    line(s, 2.05, y + 0.56, 12.1, y + 0.56, C.line, 0.7);
  });
  box(s, 9.3, 6.35, 2.8, 0.34, '3D2028', C.red);
  tx(s, 'REMOVE TEST FAILURE', 9.42, 6.44, 2.55, 0.14, { fontSize: 8, color: C.red, bold: true, align: 'center', charSpacing: 1 });
}

// 8
{
  const s = pptx.addSlide('MASTER');
  title(s, '07 / Grafana', 'One panel turns Kafka health into a story', 'The live presentation can show these panels while this slide explains what each signal means.');
  box(s, 0.65, 1.72, 8.25, 4.75, '101A29', C.line);
  tx(s, 'KAFKA OVERVIEW', 0.95, 1.95, 2.4, 0.2, { fontSize: 10, color: C.teal, bold: true, charSpacing: 1.2 });
  metric(s, 0.95, 2.35, 1.75, 'booking.created lag', '0', C.green);
  metric(s, 2.9, 2.35, 1.75, 'payment.result lag', '2', C.orange);
  metric(s, 4.85, 2.35, 1.75, 'failed messages', '1', C.red);
  metric(s, 6.8, 2.35, 1.75, 'Kafka availability', 'UP', C.green);
  box(s, 0.95, 3.45, 7.55, 2.55, C.panel, C.line);
  tx(s, 'consumer lag by partition', 1.2, 3.72, 2.2, 0.2, { fontSize: 10, color: C.muted });
  line(s, 1.25, 5.55, 8.1, 5.55, C.line, 1);
  line(s, 1.25, 4.15, 1.25, 5.55, C.line, 1);
  const chart = [[1.4, 5.1, C.teal], [2.0, 4.92, C.teal], [2.6, 5.2, C.teal], [3.2, 4.65, C.orange], [3.8, 4.92, C.orange], [4.4, 4.5, C.orange], [5.0, 4.7, C.orange], [5.6, 4.32, C.red], [6.2, 4.48, C.red], [6.8, 4.12, C.red], [7.4, 4.28, C.red]];
  for (let i = 0; i < chart.length - 1; i++) line(s, chart[i][0], chart[i][1], chart[i + 1][0], chart[i + 1][1], chart[i + 1][2], 2.2);
  chart.forEach(p => dot(s, p[0] - 0.04, p[1] - 0.04, 0.08, p[2]));
  tx(s, 'time →', 7.75, 5.7, 0.6, 0.16, { fontSize: 8, color: C.muted, align: 'right' });
  box(s, 9.35, 1.72, 3.35, 4.75, C.panel, C.purple);
  tx(s, 'WHAT TO WATCH', 9.7, 2.05, 2.5, 0.2, { fontSize: 10, color: C.purple, bold: true, charSpacing: 1.2 });
  const watch = [
    ['Lag rising', 'consumer is behind'],
    ['Failed > 0', 'inspect handler logs'],
    ['Producer fails', 'outbox should remain pending'],
    ['Broker down', 'availability probe turns red']
  ];
  watch.forEach((r, i) => {
    const y = 2.65 + i * 0.75;
    dot(s, 9.75, y + 0.08, 0.13, i === 1 ? C.red : C.purple);
    tx(s, r[0], 10.05, y, 1.95, 0.2, { fontSize: 12, bold: true });
    tx(s, r[1], 10.05, y + 0.24, 2.1, 0.18, { fontSize: 9, color: C.muted });
  });
}

// 9
{
  const s = pptx.addSlide('MASTER');
  title(s, '08 / Cache', 'Room types use cache-aside with safe fallback', 'Redis accelerates repeated reads; the database remains the source of truth.');
  service(s, 0.8, 2.5, 2.45, 1.15, 'API / Booking', 'room type request', C.teal);
  box(s, 4.05, 2.12, 2.4, 1.95, C.panel, C.orange);
  tx(s, 'REDIS', 4.45, 2.42, 1.6, 0.2, { fontSize: 11, color: C.orange, bold: true, align: 'center', charSpacing: 1 });
  tx(s, 'room-types:{id}\nroom-types:all', 4.28, 2.88, 1.95, 0.55, { fontSize: 15, bold: true, align: 'center' });
  box(s, 8.05, 2.12, 2.4, 1.95, C.panel, C.cyan);
  tx(s, 'DATABASE', 8.4, 2.42, 1.7, 0.2, { fontSize: 11, color: C.cyan, bold: true, align: 'center', charSpacing: 1 });
  tx(s, 'Room_types', 8.35, 3.0, 1.8, 0.24, { fontSize: 16, bold: true, align: 'center' });
  line(s, 3.3, 3.07, 4.0, 3.07, C.teal, 2, 'triangle');
  line(s, 6.48, 3.07, 8.0, 3.07, C.orange, 2, 'triangle');
  line(s, 8.0, 3.46, 6.48, 3.46, C.cyan, 1.5, 'triangle');
  line(s, 4.0, 3.7, 3.3, 3.7, C.green, 1.5, 'triangle');
  pill(s, 'HIT → return Redis', 3.55, 4.55, 1.9, C.green);
  pill(s, 'MISS → DB → SET 300s', 5.72, 4.55, 2.7, C.orange);
  pill(s, 'UPDATE / DELETE → invalidate', 8.72, 4.55, 2.8, C.cyan);
  note(s, 'Redis GET/SET/DEL failures are logged and the request falls back to the database. This keeps caching an optimization, not a hard dependency.', 0.9, 5.45, 5.8, C.green);
  note(s, 'Talk track: a five-minute TTL trades freshness for speed. Booking price calculation should be treated as authoritative if price freshness is critical.', 6.75, 5.45, 5.4, C.orange);
}

// 10
{
  const s = pptx.addSlide('MASTER');
  title(s, '09 / Closing', 'The story in one sentence', 'Reliable local writes, asynchronous work, explicit failure signals.');
  box(s, 0.85, 1.95, 11.65, 1.35, C.panel, C.teal);
  tx(s, 'Persist the intent → publish the event → process with a consumer group →\nthrow when recovery is possible → observe the lag and failures.', 1.2, 2.25, 10.95, 0.7, { fontSize: 22, bold: true, color: C.white, align: 'center' });
  const items = [
    ['01', 'Outbox', 'no lost booking event', C.teal],
    ['02', 'Kafka', 'decoupled services', C.orange],
    ['03', 'Retries', 'recoverable failures', C.cyan],
    ['04', 'Grafana', 'visible operations', C.purple]
  ];
  items.forEach((r, i) => {
    const x = 1.05 + i * 3.0;
    dot(s, x, 4.35, 0.35, r[3]);
    tx(s, r[0], x, 4.45, 0.35, 0.14, { fontSize: 8, color: C.black, bold: true, align: 'center' });
    tx(s, r[1], x + 0.52, 4.3, 1.8, 0.22, { fontSize: 15, bold: true, color: r[3] });
    tx(s, r[2], x + 0.52, 4.62, 1.9, 0.2, { fontSize: 10, color: C.muted });
  });
  tx(s, 'Before presenting: remove the forced Payment consumer test throw and decide how you will answer the DLQ / retry-cap question.', 1.0, 6.0, 11.25, 0.35, { fontSize: 12, color: C.orange, bold: true, align: 'center' });
}

pptx.writeFile({ fileName: process.argv[2] || 'Kafka_Architecture_Review.pptx' });

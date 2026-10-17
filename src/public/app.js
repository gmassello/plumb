const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const slotsEl = document.getElementById('slots');
const statusEl = document.getElementById('booking-status');
const nameEl = document.getElementById('name');
const modal = document.getElementById('confirm');
const bookBtn = document.getElementById('confirm-book');
let chosen = null;

document.querySelector('[data-testid="time-zone"]').textContent = timeZone;

async function loadSlots() {
  const res = await fetch(`/api/slots?tz=${encodeURIComponent(timeZone)}`);
  const slots = await res.json();
  if (!res.ok) {
    statusEl.textContent = slots.error.message;
    return;
  }
  slotsEl.replaceChildren(
    ...slots.map((s) => {
      const li = document.createElement('li');
      li.dataset.testid = `slot-${s.id}`;
      const label = document.createElement('span');
      label.textContent = `${s.localDate} ${s.localTime}`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = s.available ? 'Select' : 'Taken';
      btn.disabled = !s.available;
      btn.addEventListener('click', () => openModal(s));
      li.append(label, btn);
      return li;
    }),
  );
}

function openModal(slot) {
  chosen = slot;
  modal.querySelector('[data-testid="confirm-slot"]').textContent = `${slot.localDate} ${slot.localTime}`;
  bookBtn.disabled = true;
  modal.showModal();
  requestAnimationFrame(() => modal.classList.add('shown'));
  setTimeout(() => (bookBtn.disabled = false), 150 + Math.random() * 450);
}

function closeModal() {
  modal.classList.remove('shown');
  modal.close();
}

async function pollStatus(id) {
  for (;;) {
    const res = await fetch(`/api/bookings/${id}`);
    const booking = await res.json();
    if (!res.ok) {
      statusEl.textContent = booking.error.message;
      return;
    }
    statusEl.textContent = booking.status === 'confirmed' ? 'Booking confirmed' : 'Booking pending';
    if (booking.status === 'confirmed') return;
    await new Promise((r) => setTimeout(r, 200));
  }
}

bookBtn.addEventListener('click', async () => {
  closeModal();
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slotId: chosen.id, name: nameEl.value }),
  });
  const body = await res.json();
  if (!res.ok) {
    statusEl.textContent = body.error.message;
    await loadSlots();
    return;
  }
  statusEl.textContent = 'Booking pending';
  await loadSlots();
  await pollStatus(body.id);
});

document.getElementById('confirm-cancel').addEventListener('click', closeModal);

loadSlots();

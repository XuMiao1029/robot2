async function loadData() {
  const res = await fetch('data.json?_t=' + Date.now());
  const data = await res.json();
  document.getElementById('title').textContent = data.title;
  document.getElementById('qr1').src = data.qr1;
  document.getElementById('qr2').src = data.qr2;
}

document.addEventListener('DOMContentLoaded', loadData);
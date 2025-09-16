let qr1Base64 = "";
let qr2Base64 = "";

// 把文件转成 Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 读取现有数据
async function loadData() {
  const res = await fetch('data.json?_t=' + Date.now());
  const data = await res.json();
  document.getElementById('title').value = data.title;
  qr1Base64 = data.qr1 || "";
  qr2Base64 = data.qr2 || "";
}

document.getElementById('fileQr1').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) qr1Base64 = await fileToBase64(file);
});

document.getElementById('fileQr2').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) qr2Base64 = await fileToBase64(file);
});

document.getElementById('updateForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = document.getElementById('token').value;
  const username = document.getElementById('username').value;
  const repo = document.getElementById('repo').value;

  if (!token || !username || !repo) {
    alert('请填写 Token、用户名、仓库名');
    return;
  }

  const payload = {
    title: document.getElementById('title').value,
    qr1: qr1Base64,
    qr2: qr2Base64
  };

  // 获取当前 data.json 的 SHA
  const fileRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/data.json`, {
    headers: { Authorization: `token ${token}` }
  });
  const fileData = await fileRes.json();

  // 更新 data.json
  await fetch(`https://api.github.com/repos/${username}/${repo}/contents/data.json`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Update data.json with images',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))),
      sha: fileData.sha
    })
  });

  alert('保存成功！1分钟后前台会自动更新二维码');
});

document.addEventListener('DOMContentLoaded', loadData);

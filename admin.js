async function loadData() {
  const res = await fetch('data.json?_t=' + Date.now());
  const data = await res.json();
  document.getElementById('title').value = data.title;
  document.getElementById('qr1').value = data.qr1;
  document.getElementById('qr2').value = data.qr2;
}

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
    qr1: document.getElementById('qr1').value,
    qr2: document.getElementById('qr2').value
  };

  // 读取 data.json 获取 SHA
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
      message: 'Update data.json',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2)))),
      sha: fileData.sha
    })
  });

  alert('保存成功！1分钟后前台页面会自动更新');
});

document.addEventListener('DOMContentLoaded', loadData);
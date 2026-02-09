const button = document.getElementById('scan');
const result = document.getElementById('result');

button.addEventListener('click', async () => {
  result.textContent = 'Scanning...';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) {
    result.textContent = 'No active tab URL found.';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: tab.url })
    });

    const data = await response.json();
    if (data.jobId) {
      result.textContent = 'Queued. Open web app to view results.';
      return;
    }

    result.textContent = `${data.riskLevel.toUpperCase()} - Score ${data.riskScore}`;
  } catch (error) {
    result.textContent = 'Scan failed.';
  }
});

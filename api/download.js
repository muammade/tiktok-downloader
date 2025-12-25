export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    // المحرك الأصلي الصامد
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // نرسل البيانات كما هي للمتصفح دون فلسفة زايدة
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
}

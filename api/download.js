export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

  try {
    // سنستخدم محركاً يدعم فيسبوك بشكل أقوى
    const apiUrl = `https://api.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    
    const response = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        }
    });
    
    const data = await response.json();

    if (data && data.code === 0) {
      return res.status(200).json(data);
    } else {
      // إذا فشل تيك توك في جلب فيسبوك، نرسل رسالة خطأ واضحة لنغير الإستراتيجية
      return res.status(200).json({ code: -1, msg: "Unsupported platform or private video" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
}

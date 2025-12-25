export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    // محرك بحث أكثر شمولية
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    const response = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();

    if (data && data.code === 0) {
      return res.status(200).json(data);
    } else {
      // محاولة ثانية بتنسيق مختلف لروابط فيسبوك/إنستجرام
      return res.status(200).json({ code: -1, msg: "Failed to fetch" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
}

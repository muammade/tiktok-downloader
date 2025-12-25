export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

  try {
    // محرك TikWM يدعم تيك توك بشكل أساسي وبعض روابط FB/IG
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.code === 0) {
      return res.status(200).json(data);
    } else {
      return res.status(500).json({ error: "لم يتم العثور على الفيديو" });
    }
  } catch (error) {
    return res.status(500).json({ error: "خطأ في السيرفر" });
  }
}

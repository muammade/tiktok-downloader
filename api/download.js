export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "الرجاء إدخال الرابط" });
  }

  try {
    // محرك البحث الأساسي يدعم تيك توك وبعض روابط المنصات الأخرى
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.code === 0) {
      // إرسال البيانات بنجاح
      return res.status(200).json(data);
    } else {
      // إذا فشل المحرك الأول، يمكننا مستقبلاً إضافة محرك بديل هنا
      return res.status(500).json({ error: "فشل جلب البيانات من المصدر" });
    }
  } catch (error) {
    return res.status(500).json({ error: "خطأ في الاتصال بالسيرفر" });
  }
}

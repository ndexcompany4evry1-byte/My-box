import mysql from 'mysql2/promise';

// متغيرات البيئة
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  IMGBB_API_KEY
} = process.env;

// رفع الصورة إلى ImgBB
async function uploadToImgBB(base64Image) {
  const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: base64Image.split(',')[1], // إزالة الـ data:image/png;base64,
      name: `nfc_card_${Date.now()}`,
      expiration: 0 // لا انتهاء
    })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'فشل رفع الصورة إلى ImgBB');
  }

  return data.data.url; // الرابط المباشر للصورة
}

// إرسال إشعار Telegram
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
  });
}

// معالج الطلب
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'طريقة غير مسموحة' });
  }

  try {
    const { name, phone, quantity, designImage } = req.body;

    // التحقق من المدخلات
    if (!name || !phone || !quantity || !designImage) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'الكمية يجب أن تكون 1 أو أكثر' });
    }

    // حساب السعر (50 ريال لكل قطعة)
    const pricePerUnit = 50;
    const totalPrice = quantity * pricePerUnit;

    // رفع الصورة إلى ImgBB
    const imageUrl = await uploadToImgBB(designImage);

    // الاتصال بقاعدة البيانات
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    // حفظ الطلب
    const [result] = await connection.execute(
      `INSERT INTO orders (name, phone, quantity, price, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, phone, quantity, totalPrice, imageUrl]
    );

    await connection.end();

    // إرسال إشعار Telegram
    const message = `
🛒 *طلب جديد لبطاقات NFC*

👤 الاسم: ${name}
📞 الهاتف: \`${phone}\`
📦 الكمية: ${quantity} قطعة
💰 السعر: ${totalPrice} ريال

🖼️ التصميم: ${imageUrl}

🆔 رقم الطلب: #${result.insertId}
🕐 الوقت: ${new Date().toLocaleString('ar-SA')}
    `.trim();

    await sendTelegramMessage(message);

    // الرد الناجح
    res.status(200).json({
      success: true,
      orderId: result.insertId,
      message: 'تم استلام طلبك بنجاح!'
    });

  } catch (error) {
    console.error('خطأ في معالجة الطلب:', error);
    res.status(500).json({
      error: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة لاحقًا.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
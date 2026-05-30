async function sendTestMessage() {
    // جيت هب هيسحب الأرقام دي من الخزنة اللي إنت لسه عاملها
    const phoneId = process.env.PHONE_ID;
    const metaToken = process.env.META_TOKEN;

    // ⚠️ اكتب رقمك اللي أكدته في ميتا هنا (بمفتاح مصر 20 قبل الرقم)
    const targetNumber = "201280531968"; // عدل الرقم ده

    const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;

    console.log("🚀 جاري إرسال رسالة تجريبية الآن...");

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${metaToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: targetNumber,
                type: "text",
                text: { body: "مرحباً يا دكتور أحمد! 🚀\nهذه رسالة تجريبية من البوت الخاص بمتجر سمان ههيا.. السيستم شغال زي الفل! 🎉" }
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log("✅ تم إرسال الرسالة بنجاح!");
        } else {
            console.log("❌ فشل الإرسال:");
            console.log(data);
        }
    } catch (error) {
        console.error("حدث خطأ:", error);
    }
}

sendTestMessage();

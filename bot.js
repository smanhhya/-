async function runBot() {
    // المفاتيح السرية
    const projectId = process.env.FIREBASE_PROJECT_ID; 
    const phoneId = process.env.PHONE_ID;
    const metaToken = process.env.META_TOKEN;

    // رابط قاعدة البيانات
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/orders`;

    console.log("🚀 جاري فحص الأوردرات...");

    try {
        const response = await fetch(firestoreUrl);
        const data = await response.json();

        if (!data.documents) {
            console.log("لا يوجد أوردرات مسجلة حالياً.");
            return;
        }

        for (const doc of data.documents) {
            const fields = doc.fields;
            
            // سحب البيانات بالأسماء اللي ظهرت في صورتك بالظبط
            const customerName = fields.customerName ? fields.customerName.stringValue : "يا فندم";
            const phone = fields.customerPhone ? fields.customerPhone.stringValue : "";
            
            // بنفترض إن خانة الحالة اسمها status وقيمتها "تم التسليم"
            const status = fields.status ? fields.status.stringValue : ""; 
            
            // متغير عشان ميبعتش للعميل مرتين
            const isFollowUpSent = fields.isFollowUpSent ? fields.isFollowUpSent.booleanValue : false;

            if (status === "تم التسليم" && !isFollowUpSent && phone) {
                
                // تظبيط الرقم عشان يقبله واتساب (إضافة مفتاح 2)
                let formattedPhone = phone.startsWith("0") ? "2" + phone : phone;

                // الرسالة اللي هتوصل للعميل
                const messageText = `أهلاً بك ${customerName} 🌟\nنتمنى تكون منتجات سمان ههيا عجبتك!\nعشان دايماً بنسعى نقدم الأفضل، رأيك في الأوردر يهمنا جداً.`;

                const whatsappUrl = `https://graph.facebook.com/v17.0/${phoneId}/messages`;
                
                const metaResponse = await fetch(whatsappUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${metaToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        to: formattedPhone,
                        type: "text",
                        text: { body: messageText }
                    })
                });

                if (metaResponse.ok) {
                    console.log(`✅ تم إرسال رسالة التقييم للعميل: ${customerName} على الرقم (${formattedPhone})`);
                } else {
                    console.log(`❌ فشل إرسال الرسالة للعميل: ${customerName}`);
                }
            }
        }
        console.log("🏁 انتهت عملية الفحص بنجاح!");
    } catch (error) {
        console.error("❌ حدث خطأ في النظام:", error);
    }
}

runBot();

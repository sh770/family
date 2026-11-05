// קבלת הודעת Push והצגתה כהתראה גם כשהאתר אינו פתוח
self.addEventListener("push", event => {
  // מתעלמים מהודעה ריקה כדי למנוע שגיאה בפענוח
  if (!event.data) return;

  // קוראים את פרטי האירוע שנשלחו משרת Cloudflare
  const data = event.data.json();

  // מציגים התראה מערכתית עם כותרת, תוכן וקישור לחזרה לאתר
  event.waitUntil(
    self.registration.showNotification(data.title || "תזכורת משפחתית", {
      body: data.body || "יש אירוע משפחתי קרוב",
      icon: "./icon.png",
      badge: "./icon.png",
      data: { url: data.url || "https://sh770.github.io/family/" },
      tag: data.tag || "family-event"
    })
  );
});

// פתיחת האתר כאשר המשתמש לוחץ על ההתראה
self.addEventListener("notificationclick", event => {
  // סוגרים את ההתראה לאחר הלחיצה
  event.notification.close();

  // מנסים להתמקד בלשונית קיימת, ואם אין כזו פותחים לשונית חדשה
  event.waitUntil((async () => {
    const target = event.notification.data?.url || "https://sh770.github.io/family/";
    const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

    for (const client of clientsList) {
      if (client.url.startsWith("https://sh770.github.io/family/") && "focus" in client) {
        await client.focus();
        return;
      }
    }

    await self.clients.openWindow(target);
  })());
});

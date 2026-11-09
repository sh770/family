// שירות עובד מקומי להצגת התראות שנוצרות כשהאתר פתוח בלבד

// פתיחת האתר כאשר המשתמש לוחץ על התראה מקומית
self.addEventListener("notificationclick", event => {
  // סוגרים את ההתראה לאחר הלחיצה
  event.notification.close();

  // מנסים להתמקד בלשונית קיימת, ואם אין כזו פותחים לשונית חדשה
  event.waitUntil((async () => {
    const target = "https://sh770.github.io/family/";
    const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

    for (const client of clientsList) {
      if ("focus" in client) {
        await client.focus();
        return;
      }
    }

    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});

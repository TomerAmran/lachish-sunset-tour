# שקיעה בתל: סיורי שקיעה היסטוריים בתל לכיש

אתר סטטי (HTML/CSS/JS בלי build) של חברת סיורים בדיונית. הוא נבנה כדי שטיול השקיעה בשישי 9.10 ייראה אמיתי, ובפועל מחכה שם מסיבת הפתעה 🎉

## מה אפשר לשנות
- **מועדים, שעות ומקומות פנויים:** המערך `upcomingTours` בראש `script.js`. הסיור של 9.10 מסומן `full` ("ההרשמה מלאה"), כך שהיא לא תוכל להירשם אליו בעצמה ("תפסתי לנו את המקומות האחרונים").
- **שעות המסלול:** בחלק "איך נראה הסיור" ב־`index.html`.
- **טופס ההרשמה לא שולח כלום.** הוא רק מציג הודעת תודה.

## העלאה ל־GitHub Pages
```bash
# ליצור ריפו ציבורי בשם lachish-sunset-tour ב־github.com/new, ואז:
git remote add origin https://github.com/<USERNAME>/lachish-sunset-tour.git
git push -u origin main
```
אחר כך: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
האתר יעלה בכתובת `https://<USERNAME>.github.io/lachish-sunset-tour/`.


## קרדיט לתמונות
- שקיעות בלכיש: [Beny Shlevich](https://www.flickr.com/photos/17088109@N00/), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)
- שער ששת התאים והדרך העתיקה לשער: [Ian Scott](https://www.flickr.com/people/38000818@N06), [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)
- שרידי הארמון־מצודה: [Oren Rozen](https://commons.wikimedia.org/wiki/File:Lachish_160313_05.jpg), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)

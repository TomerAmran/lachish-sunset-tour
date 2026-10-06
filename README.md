# 🌅 טיול שקיעה בלכיש: הזמנה בסגנון סטורי

אתר סטטי (HTML/CSS/JS בלי build) שנראה כמו סטורי של אינסטגרם ומזמין לטיול שקיעה בתל לכיש ביום שישי, 9.10.2026.

## התאמה אישית
בראש `script.js` יש אובייקט `invitationSettings`:
- `inviteeName`: השם שלה. מופיע במסך הפתיחה ("___, יש לך הזמנה")
- `signature`: החתימה שמופיעה אחרי שהיא מאשרת
- זמני המפגש, שעת השקיעה ונקודת המפגש

## העלאה ל־GitHub Pages
```bash
# ליצור ריפו ציבורי בשם lachish-sunset-tour ב־github.com/new, ואז:
git remote add origin https://github.com/<USERNAME>/lachish-sunset-tour.git
git push -u origin main
```
אחר כך: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
האתר יעלה בכתובת `https://<USERNAME>.github.io/lachish-sunset-tour/`.

כדי שתופיע תמונה בתצוגה המקדימה בוואטסאפ, צריך לעדכן את `og:image` ב־`index.html` עם שם המשתמש שלך.

## תצוגה מקדימה
- לפתוח את `index.html` בדפדפן
- `?slide=4` פותח שקופית מסוימת במצב מושהה

## קרדיט לתמונות
כל התמונות צולמו בלכיש על ידי [Beny Shlevich](https://www.flickr.com/photos/17088109@N00/) ופורסמו ברישיון [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/):
- [Sunset over beauty](https://www.flickr.com/photos/17088109@N00/4564591723)
- [וכבשה ואיילת תהיינה עדות](https://www.flickr.com/photos/17088109@N00/4564589813)
- [We were the lovers](https://www.flickr.com/photos/17088109@N00/4564591331)
- [הדרך ארוכה ומפותלת](https://www.flickr.com/photos/17088109@N00/4564591103)
- [ויידך ריקות ועירך רחוקה](https://www.flickr.com/photos/17088109@N00/4564590001)

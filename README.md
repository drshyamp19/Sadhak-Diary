# 📖 Sadhak Diary (साधक डायरी)

A comprehensive, responsive, multi-language web application for managing, archiving, and celebrating Sadhak records (Initiated, Aspiring, and Devotee Family).

---

## 🌟 Key Features

1. **Three Sadhak Categories Supported**:
   - 🟢 **दीक्षा झालेली आहे (Initiated Disciples)**: Tracks initiation date, Diksha type (*Mantra / Shaktipat / Other*), and revered Diksha Guru name (*Swami Vishnutirth, Swami Shivom Tirth, Swami Gopal Tirth, Swami Sureshanand Tirth, Swami Madhavanand Tirth, Other*).
   - 🟠 **दीक्षा घेणार / इच्छुक (Aspiring Seekers)**: Tracks desired initiation type, preferred guru/lineage, tentative date/shibir, and spiritual background. Past initiation date is not forced.
   - 🔵 **दीक्षा झालेली नाही (Devotee Family / Parivar)**: Captures spiritual association (*Satsang, Dhyan, Naam Japa, Seva, General Contact*) without mandatory Diksha constraints.

2. **🌐 Multi-Language Switcher (भाषा निवड)**:
   - Instant 1-click toggle between **मराठी (Marathi)**, **हिंदी (Hindi)**, and **English**.
   - Complete localization across all form labels, placeholders, validation hints, status options, and celebration messages.
   - User preference automatically saved in `localStorage`.

3. **📷 Sadhak Photo Upload (साधकाचा फोटो)**:
   - Built-in photo uploader with real-time circular avatar preview.
   - Supports JPG, PNG, and WEBP formats up to 5MB.
   - Automatically stored on the server (`/static/uploads/photos/`) and linked to the database record.
   - Displayed in the directory table and celebratory greeting cards.

4. **🎂 Birthday & Diksha Anniversary Tracker (उत्सव व स्मरण ट्रॅकर)**:
   - Dedicated modal widget tracking:
     - ☸️ **Upcoming Diksha Anniversaries (आगामी दीक्षा वर्धापनदिन)**: Calculates completed years of Diksha and days remaining.
     - 🎂 **Upcoming Birthdays (आगामी वाढदिवस)**: Calculates turning age and days remaining.
   - **📲 One-Click WhatsApp Greetings (थेट व्हॉट्सॲप शुभेच्छा)**:
     - Sends prefilled, respectful, devotional wishes directly to the sadhak's WhatsApp number with a single click.

5. **Dynamic Cascading Address Dropdowns**:
   - State $\rightarrow$ District $\rightarrow$ Tehsil / Taluka dynamic hierarchical selection.
   - Comprehensive Indian location dataset.

6. **Directory & Export**:
   - Real-time search by Name, Mobile, District, Guru, or Notes.
   - Category filter tabs (`All`, `Initiated`, `Aspiring`, `Devotees`).
   - One-click CSV export (`/api/export/csv`).

---

## 🚀 How to Run

1. Open PowerShell or Command Prompt:
   ```powershell
   cd C:\Users\student\.gemini\antigravity\scratch\sadhak-diary
   python app.py
   ```
2. Open your web browser at:
   ```
   http://127.0.0.1:5000
   ```
3. Or double-click `standalone.html` for offline portable usage without a server.

---

## 🗄️ Database Schema (`sadhaks` table)

```sql
CREATE TABLE sadhaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    mobile TEXT NOT NULL,
    house_building_ward TEXT NOT NULL,
    street_area_landmark TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    tehsil TEXT NOT NULL,
    pincode TEXT NOT NULL,
    diksha_status TEXT NOT NULL DEFAULT 'दीक्षा झालेली आहे',
    diksha_date TEXT,
    diksha_type TEXT,
    diksha_type_other TEXT,
    diksha_guru TEXT,
    diksha_guru_other TEXT,
    interest_notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📁 Project Structure

```
sadhak-diary/
├── app.py                      # Flask backend, photo uploads & API endpoints
├── database.py                 # SQLite database, schema, queries & anniversary logic
├── sadhak_diary.db             # Persistent SQLite database
├── test_db.py                  # Automated test suite
├── standalone.html             # Self-contained offline portable version
├── README.md                   # Full documentation
├── templates/
│   └── index.html              # HTML5 UI with cards, language switcher & modals
└── static/
    ├── css/
    │   └── style.css           # Modern stylesheet with animations & tracker styles
    ├── js/
    │   ├── translations.js     # Full i18n dictionaries (Marathi, Hindi, English)
    │   ├── locations.js        # State -> District -> Tehsil dataset
    │   └── app.js              # Frontend logic, photo handler & tracker
    └── uploads/
        └── photos/             # Uploaded sadhak photos directory
```

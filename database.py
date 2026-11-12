"""
Database management module for Sadhak Diary web app.
Handles SQLite schema creation, migrations, validation, insertions, and queries.
Supports:
- दीक्षा स्थिती (Initiated, Aspiring, Devotee)
- Photo Upload URLs
- Birthday & Diksha Anniversary calculations
"""
import os
import sqlite3
import shutil
from datetime import datetime, date

IS_VERCEL = bool(os.environ.get('VERCEL'))

if IS_VERCEL:
    # Vercel has read-only root filesystem. Use writable /tmp directory
    DB_PATH = '/tmp/sadhak_diary.db'
    bundled_db = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sadhak_diary.db")
    if os.path.exists(bundled_db) and not os.path.exists(DB_PATH):
        try:
            shutil.copyfile(bundled_db, DB_PATH)
        except Exception as e:
            print("Error initializing /tmp database:", e)
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sadhak_diary.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='sadhaks'")
    exists = cursor.fetchone()

    if not exists:
        cursor.execute("""
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
        """)
    else:
        cursor.execute("PRAGMA table_info(sadhaks)")
        columns_info = {col[1]: col for col in cursor.fetchall()}
        
        if 'photo_url' not in columns_info:
            cursor.execute("ALTER TABLE sadhaks ADD COLUMN photo_url TEXT")
        if 'diksha_status' not in columns_info:
            cursor.execute("ALTER TABLE sadhaks ADD COLUMN diksha_status TEXT NOT NULL DEFAULT 'दीक्षा झालेली आहे'")
        if 'interest_notes' not in columns_info:
            cursor.execute("ALTER TABLE sadhaks ADD COLUMN interest_notes TEXT")

    conn.commit()
    conn.close()

def save_sadhak(data):
    """
    Validates and saves a new Sadhak record.
    Returns (success: bool, result_or_error)
    """
    required_base_fields = [
        'full_name', 'dob', 'mobile',
        'house_building_ward', 'street_area_landmark',
        'state', 'district', 'tehsil', 'pincode'
    ]
    
    for field in required_base_fields:
        val = str(data.get(field, '')).strip()
        if not val:
            return False, f"Missing required field: {field}"

    # Mobile validation (10 digits)
    mobile = str(data.get('mobile', '')).strip()
    clean_mobile = "".join(filter(str.isdigit, mobile))
    if len(clean_mobile) != 10:
        return False, "Mobile number must be exactly 10 digits."

    # Pincode validation (6 digits)
    pincode = str(data.get('pincode', '')).strip()
    clean_pincode = "".join(filter(str.isdigit, pincode))
    if len(clean_pincode) != 6:
        return False, "Pincode must be exactly 6 digits."

    diksha_status = str(data.get('diksha_status', 'दीक्षा झालेली आहे')).strip()
    diksha_date = str(data.get('diksha_date', '')).strip() or None
    diksha_type = str(data.get('diksha_type', '')).strip() or None
    diksha_type_other = str(data.get('diksha_type_other', '')).strip() or None
    diksha_guru = str(data.get('diksha_guru', '')).strip() or None
    diksha_guru_other = str(data.get('diksha_guru_other', '')).strip() or None
    interest_notes = str(data.get('interest_notes', '')).strip() or None
    photo_url = str(data.get('photo_url', '')).strip() or None

    # Status-specific validation
    if diksha_status == 'दीक्षा झालेली आहे':
        if not diksha_date:
            return False, "Please enter the Diksha Date (दीक्षा दिनांक आवश्यक आहे)."
        if not diksha_type:
            return False, "Please select the Diksha Type (दीक्षा प्रकार आवश्यक आहे)."
        if diksha_type == 'Other' and not diksha_type_other:
            return False, "Please specify the custom Diksha Type."
        if not diksha_guru:
            return False, "Please select the Diksha Guru name (दीक्षा गुरूंचे नाव आवश्यक आहे)."
        if diksha_guru == 'Other' and not diksha_guru_other:
            return False, "Please specify the custom Diksha Guru name."
            
    elif diksha_status == 'दीक्षा घेणार / इच्छुक':
        if diksha_type == 'Other' and not diksha_type_other:
            return False, "Please specify the custom Diksha Type."
        if diksha_guru == 'Other' and not diksha_guru_other:
            return False, "Please specify the custom Guru name."

    elif diksha_status == 'दीक्षा झालेली नाही':
        diksha_date = None
        diksha_type = "लागू नाही (Not Initiated)"
        diksha_guru = "लागू नाही (N/A)"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO sadhaks (
            full_name, dob, mobile,
            house_building_ward, street_area_landmark,
            state, district, tehsil, pincode,
            diksha_status, diksha_date, diksha_type, diksha_type_other,
            diksha_guru, diksha_guru_other, interest_notes, photo_url, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(data['full_name']).strip(),
        str(data['dob']).strip(),
        clean_mobile,
        str(data['house_building_ward']).strip(),
        str(data['street_area_landmark']).strip(),
        str(data['state']).strip(),
        str(data['district']).strip(),
        str(data['tehsil']).strip(),
        clean_pincode,
        diksha_status,
        diksha_date,
        diksha_type,
        diksha_type_other if diksha_type == 'Other' else None,
        diksha_guru,
        diksha_guru_other if diksha_guru == 'Other' else None,
        interest_notes,
        photo_url,
        datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    ))
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return True, record_id

def get_all_sadhaks(limit=500, search="", status_filter=""):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM sadhaks WHERE 1=1"
    params = []

    if status_filter and status_filter != 'all':
        query += " AND diksha_status = ?"
        params.append(status_filter)

    if search:
        query += " AND (full_name LIKE ? OR mobile LIKE ? OR district LIKE ? OR diksha_guru LIKE ? OR interest_notes LIKE ?)"
        search_term = f"%{search}%"
        params.extend([search_term, search_term, search_term, search_term, search_term])

    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()
    sadhaks = [dict(row) for row in rows]
    conn.close()
    return sadhaks

def get_sadhak_by_id(record_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sadhaks WHERE id = ?", (record_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as total FROM sadhaks")
    total = cursor.fetchone()['total']
    
    cursor.execute("SELECT COUNT(*) as count FROM sadhaks WHERE diksha_status = 'दीक्षा झालेली आहे'")
    completed_count = cursor.fetchone()['count']

    cursor.execute("SELECT COUNT(*) as count FROM sadhaks WHERE diksha_status = 'दीक्षा घेणार / इच्छुक'")
    aspiring_count = cursor.fetchone()['count']

    cursor.execute("SELECT COUNT(*) as count FROM sadhaks WHERE diksha_status = 'दीक्षा झालेली नाही'")
    none_count = cursor.fetchone()['count']

    cursor.execute("""
        SELECT state, COUNT(*) as count 
        FROM sadhaks 
        GROUP BY state 
        ORDER BY count DESC LIMIT 5
    """)
    states = [dict(r) for r in cursor.fetchall()]
    
    conn.close()
    return {
        "total": total,
        "completed_count": completed_count,
        "aspiring_count": aspiring_count,
        "none_count": none_count,
        "top_states": states
    }

def get_upcoming_anniversaries(days_window=30):
    """
    Returns upcoming birthdays and Diksha anniversaries occurring in next 30 days.
    Includes location details (street_area_landmark, tehsil, district).
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, full_name, mobile, dob, diksha_status, diksha_date, diksha_guru, photo_url,
               street_area_landmark, tehsil, district, state
        FROM sadhaks
    """)
    rows = cursor.fetchall()
    conn.close()

    today = date.today()
    upcoming_birthdays = []
    upcoming_dikshas = []

    for r in rows:
        row = dict(r)
        
        # Build clean location string (उदा. रनाला, कामठी)
        loc_parts = []
        if row.get('street_area_landmark'):
            loc_parts.append(row['street_area_landmark'])
        if row.get('tehsil') and row['tehsil'] != row.get('street_area_landmark'):
            loc_parts.append(row['tehsil'])
        elif row.get('district') and row['district'] not in loc_parts:
            loc_parts.append(row['district'])
        location_str = ", ".join(loc_parts) if loc_parts else (row.get('district') or '')

        # Birthday calculation
        dob_str = row.get('dob')
        if dob_str:
            try:
                dob = datetime.strptime(dob_str, "%Y-%m-%d").date()
                bday_this_year = dob.replace(year=today.year)
                if bday_this_year < today:
                    bday_next = dob.replace(year=today.year + 1)
                else:
                    bday_next = bday_this_year
                
                diff_days = (bday_next - today).days
                if 0 <= diff_days <= days_window:
                    age = bday_next.year - dob.year
                    upcoming_birthdays.append({
                        "id": row['id'],
                        "full_name": row['full_name'],
                        "mobile": row['mobile'],
                        "location": location_str,
                        "date_str": bday_next.strftime("%d %b"),
                        "days_left": diff_days,
                        "age": age,
                        "is_today": diff_days == 0,
                        "photo_url": row.get('photo_url')
                    })
            except Exception:
                pass

        # Diksha Anniversary calculation
        diksha_str = row.get('diksha_date')
        if diksha_str and row.get('diksha_status') == 'दीक्षा झालेली आहे':
            try:
                diksha_dt = datetime.strptime(diksha_str, "%Y-%m-%d").date()
                diksha_this_year = diksha_dt.replace(year=today.year)
                if diksha_this_year < today:
                    diksha_next = diksha_dt.replace(year=today.year + 1)
                else:
                    diksha_next = diksha_this_year
                
                diff_days = (diksha_next - today).days
                if 0 <= diff_days <= days_window:
                    years = diksha_next.year - diksha_dt.year
                    upcoming_dikshas.append({
                        "id": row['id'],
                        "full_name": row['full_name'],
                        "mobile": row['mobile'],
                        "location": location_str,
                        "date_str": diksha_next.strftime("%d %b"),
                        "days_left": diff_days,
                        "years_completed": years,
                        "is_today": diff_days == 0,
                        "guru": row.get('diksha_guru'),
                        "photo_url": row.get('photo_url')
                    })
            except Exception:
                pass

    upcoming_birthdays.sort(key=lambda x: x['days_left'])
    upcoming_dikshas.sort(key=lambda x: x['days_left'])

    return {
        "birthdays": upcoming_birthdays,
        "diksha_anniversaries": upcoming_dikshas
    }

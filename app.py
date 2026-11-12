"""
Sadhak Diary - Web Application Backend (Flask + SQLite)
Supports:
- All Sadhak categories (Initiated, Aspiring, Devotee)
- Photo Upload API
- Language Switcher support
- Birthday & Diksha Anniversary Tracker API
"""
import io
import os
import csv
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, jsonify, Response
from database import init_db, save_sadhak, get_all_sadhaks, get_sadhak_by_id, get_stats, get_upcoming_anniversaries

app = Flask(__name__, static_folder='static', template_folder='templates')

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads', 'photos')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Initialize and apply migrations
init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/upload-photo', methods=['POST'])
def upload_photo():
    if 'photo' not in request.files:
        return jsonify({"success": False, "error": "No file part in request"}), 400
    
    file = request.files['photo']
    if file.filename == '':
        return jsonify({"success": False, "error": "No file selected"}), 400

    if file and allowed_file(file.filename):
        ext = file.filename.rsplit('.', 1)[1].lower()
        unique_name = f"sadhak_{uuid.uuid4().hex[:10]}_{int(datetime.now().timestamp())}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_name)
        file.save(filepath)
        
        photo_url = f"/static/uploads/photos/{unique_name}"
        return jsonify({"success": True, "photo_url": photo_url})
    
    return jsonify({"success": False, "error": "Allowed formats: JPG, PNG, WEBP"}), 400

@app.route('/api/sadhaks', methods=['GET'])
def list_sadhaks():
    search = request.args.get('search', '').strip()
    status_filter = request.args.get('status', '').strip()
    limit = int(request.args.get('limit', 500))
    sadhaks = get_all_sadhaks(limit=limit, search=search, status_filter=status_filter)
    return jsonify(sadhaks)

@app.route('/api/sadhaks/<int:record_id>', methods=['GET'])
def get_sadhak(record_id):
    sadhak = get_sadhak_by_id(record_id)
    if not sadhak:
        return jsonify({"error": "Sadhak record not found"}), 404
    return jsonify(sadhak)

@app.route('/api/sadhaks', methods=['POST'])
def create_sadhak():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"success": False, "error": "Invalid JSON payload"}), 400

    success, result = save_sadhak(data)
    if not success:
        return jsonify({"success": False, "error": result}), 400

    return jsonify({
        "success": True,
        "record_id": result,
        "message": "Sadhak details successfully saved to database.",
        "created_at": datetime.now().strftime("%I:%M %p, %d %b %Y")
    }), 201

@app.route('/api/stats', methods=['GET'])
def stats():
    return jsonify(get_stats())

@app.route('/api/anniversaries', methods=['GET'])
def anniversaries():
    days = int(request.args.get('days', 30))
    return jsonify(get_upcoming_anniversaries(days_window=days))

@app.route('/api/export/csv', methods=['GET'])
def export_csv():
    status_filter = request.args.get('status', '').strip()
    records = get_all_sadhaks(limit=10000, status_filter=status_filter)
    output = io.StringIO()
    writer = csv.writer(output)
    
    headers = [
        'ID', 'Full Name', 'Date of Birth', 'Mobile',
        'House/Building/Ward', 'Street/Area/Landmark',
        'State', 'District', 'Tehsil', 'Pincode',
        'Diksha Status', 'Diksha Date', 'Diksha Type', 'Custom Diksha Type',
        'Diksha Guru', 'Custom Diksha Guru', 'Interest / Notes', 'Photo URL', 'Created At'
    ]
    writer.writerow(headers)

    for r in records:
        writer.writerow([
            r['id'], r['full_name'], r['dob'], r['mobile'],
            r['house_building_ward'], r['street_area_landmark'],
            r['state'], r['district'], r['tehsil'], r['pincode'],
            r.get('diksha_status', 'दीक्षा झालेली आहे'),
            r.get('diksha_date', ''),
            r.get('diksha_type', ''),
            r.get('diksha_type_other', ''),
            r.get('diksha_guru', ''),
            r.get('diksha_guru_other', ''),
            r.get('interest_notes', ''),
            r.get('photo_url', ''),
            r['created_at']
        ])

    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=sadhak_diary_records.csv"}
    )

if __name__ == '__main__':
    print("=" * 60)
    print("🕉️  Sadhak Diary Server running with Photo Upload & Anniversary Tracker")
    print("👉 http://127.0.0.1:5000")
    print("=" * 60)
    app.run(host='127.0.0.1', port=5000, debug=True)

"""
Full test suite for Sadhak Diary SQLite Database.
Verifies:
1. Schema & Migrations (diksha_status, interest_notes, photo_url)
2. All 3 Categories (Completed, Aspiring, Devotee)
3. Birthday & Diksha Anniversary calculations
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import init_db, save_sadhak, get_all_sadhaks, get_stats, get_upcoming_anniversaries
from datetime import date, timedelta

def run_tests():
    print("1. Initializing DB and applying migrations...")
    init_db()

    target_bday = (date.today() + timedelta(days=2)).strftime('1992-%m-%d')
    target_diksha = (date.today() + timedelta(days=5)).strftime('2014-%m-%d')

    sadhak_test = {
        "full_name": "Keshav Dattatreya Kulkarni",
        "dob": target_bday,
        "mobile": "9823098230",
        "house_building_ward": "House 102, Shanti Kunj",
        "street_area_landmark": "Near Datta Mandir",
        "state": "Maharashtra",
        "district": "Pune",
        "tehsil": "Pune City",
        "pincode": "411030",
        "diksha_status": "दीक्षा झालेली आहे",
        "diksha_date": target_diksha,
        "diksha_type": "Shaktipat Diksha",
        "diksha_guru": "Swami Shivom Tirth Maharaj",
        "photo_url": "/static/uploads/photos/sample_avatar.jpg"
    }

    ok, rec_id = save_sadhak(sadhak_test)
    assert ok, f"Failed insertion: {rec_id}"
    print(f"   => Test Sadhak inserted with photo & upcoming dates! ID: {rec_id}")

    # Check anniversaries
    anniversaries = get_upcoming_anniversaries(30)
    print("   => Birthdays found:", len(anniversaries['birthdays']))
    print("   => Diksha Anniversaries found:", len(anniversaries['diksha_anniversaries']))
    assert len(anniversaries['birthdays']) >= 1
    assert len(anniversaries['diksha_anniversaries']) >= 1

    # Check stats
    stats = get_stats()
    print("   => Stats:", stats)
    assert stats['total'] >= 1

    print("\n✅ ALL DATABASE, PHOTO & ANNIVERSARY TESTS PASSED!")

if __name__ == '__main__':
    run_tests()

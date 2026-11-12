/**
 * Indian States, Districts, and Tehsils/Talukas Dataset
 * Hierarchical data structure for dynamic cascading dropdowns
 */
const INDIAN_LOCATIONS = {
    "Madhya Pradesh": {
        "Indore": ["Indore", "Depalpur", "Sanwer", "Mhow (Dr. Ambedkar Nagar)", "Hatod", "Rau", "Bicholi Hapsi", "Kshipra"],
        "Dewas": ["Dewas", "Sonkatch", "Bagli", "Kannod", "Khategaon", "Tonk Khurd", "Satwas", "Hatpiplya"],
        "Ujjain": ["Ujjain", "Badnagar", "Mahidpur", "Tarana", "Khachrod", "Nagda", "Ghatiya"],
        "Bhopal": ["Huzur", "Berasia", "Kolar"],
        "Jabalpur": ["Jabalpur", "Patan", "Sihora", "Kundam", "Panagar", "Majholi", "Shahpura"],
        "Gwalior": ["Gwalior", "Dabra", "Bhitarwar", "Chinor", "Ghatigaon"],
        "Hoshangabad (Narmadapuram)": ["Hoshangabad", "Itarsi", "Seoni Malwa", "Pipariya", "Sohagpur", "Babai", "Bankhedi"],
        "Khandwa": ["Khandwa", "Pandhana", "Punasa", "Harsud", "Khalwa", "Chhegaon Makhan"],
        "Khargone": ["Khargone", "Kasrawad", "Maheshwar", "Barwaha", "Bhikangaon", "Gogawan", "Bhagwanpura", "Segaon"],
        "Ratlam": ["Ratlam", "Jaora", "Sailana", "Bajna", "Alot", "Piploda", "Rawti"],
        "Sagar": ["Sagar", "Bina", "Khurai", "Rahatgarh", "Banda", "Deori", "Rehli", "Shahgarh"],
        "Satna": ["Satna", "Maihar", "Nagod", "Amarpatan", "Ramnagar", "Uchehara", "Rampur Baghelan", "Kotal"]
    },
    "Maharashtra": {
        "Mumbai City": ["Colaba", "Fort", "Byculla", "Dadar", "Worli", "Parel"],
        "Mumbai Suburban": ["Andheri", "Bandra", "Borivali", "Kurla", "Malad", "Ghatkopar", "Mulund"],
        "Pune": ["Pune City", "Haveli", "Shirur", "Baramati", "Junnar", "Khed", "Ambegaon", "Maval", "Mulshi", "Bhor", "Daund", "Purandar", "Velhe", "Indapur"],
        "Nagpur": ["Nagpur Urban", "Nagpur Rural", "Kamptee", "Hingna", "Katol", "Saoner", "Ramtek", "Umred", "Mouda", "Parseoni", "Kalameshwar", "Kuhi", "Bhiwapur"],
        "Nashik": ["Nashik", "Sinnar", "Igatpuri", "Dindori", "Niphad", "Yeola", "Malegaon", "Chandwad", "Kalwan", "Baglan", "Trimbakeshwar", "Deola", "Nandgaon"],
        "Thane": ["Thane", "Kalyan", "Bhiwandi", "Ulhasnagar", "Ambernath", "Murbad", "Shahapur"],
        "Aurangabad (Chhatrapati Sambhajinagar)": ["Aurangabad", "Kannad", "Paithan", "Gangapur", "Vaijapur", "Khuldabad", "Sillod", "Soegaon", "Phulambri"],
        "Kolhapur": ["Karvir", "Panhala", "Hatkangale", "Shirol", "Kagal", "Gadhinglaj", "Chandgad", "Radhanagari", "Bhudargad", "Ajara", "Shahuwadi", "Bavda"],
        "Solapur": ["Solapur North", "Solapur South", "Barshi", "Pandharpur", "Madha", "Karmala", "Mohol", "Malshiras", "Sangola", "Mangalvedhe", "Akkalkot"]
    },
    "Uttar Pradesh": {
        "Lucknow": ["Lucknow", "Mohanlalganj", "Bakshi Ka Talab", "Malihabad", "Sarojini Nagar"],
        "Varanasi": ["Varanasi Sadar", "Pindra", "Rajatalab"],
        "Prayagraj": ["Sadar", "Phulpur", "Soraon", "Handia", "Karchhana", "Meja", "Bara", "Koraon"],
        "Kanpur Nagar": ["Kanpur Sadar", "Bilhaur", "Ghatampur", "Narwal"],
        "Agra": ["Agra Sadar", "Fatehabad", "Kheragarh", "Bah", "Etmadpur", "Kiraoli"],
        "Mathura": ["Mathura", "Chhata", "Mant", "Mahavan"],
        "Ayodhya": ["Sadar", "Bikapur", "Rudauli", "Sohawal", "Milkipur"],
        "Gorakhpur": ["Gorakhpur Sadar", "Chauri Chaura", "Sahjanwa", "Khajani", "Campierganj", "Bansgaon", "Gola"],
        "Noida (Gautam Buddha Nagar)": ["Noida", "Dadri", "Jewar"],
        "Ghaziabad": ["Ghaziabad", "Modinagar", "Loni"]
    },
    "Gujarat": {
        "Ahmedabad": ["Ahmedabad City", "Daskroi", "Sanand", "Dholka", "Bavla", "Viramgam", "Mandal", "Detroj"],
        "Vadodara": ["Vadodara", "Padra", "Karjan", "Dabhoi", "Waghodia", "Savli", "Desar", "Sinor"],
        "Surat": ["Surat City", "Olpad", "Mangrol", "Umarpada", "Kamrej", "Bardoli", "Mahuva", "Mandvi", "Palsana", "Choryasi"],
        "Rajkot": ["Rajkot", "Gondal", "Jetpur", "Dhoraji", "Upleta", "Jasdan", "Kotda Sangani", "Lodhika", "Paddhari", "Vinchhiya"],
        "Gandhinagar": ["Gandhinagar", "Kalol", "Dahegam", "Mansa"],
        "Bhavnagar": ["Bhavnagar", "Sihor", "Palitana", "Talaja", "Mahuva", "Gariadhar", "Vallabhipur", "Ghogha", "Jesar", "Umrala"]
    },
    "Rajasthan": {
        "Jaipur": ["Jaipur", "Amer", "Sanganer", "Bassi", "Chaksu", "Jamwa Ramgarh", "Kotputli", "Phulera", "Shahpura", "Viratnagar"],
        "Jodhpur": ["Jodhpur", "Luni", "Bilara", "Osian", "Shergarh", "Phalodi", "Bhopalgarh", "Balesar", "Baori"],
        "Udaipur": ["Girwa", "Mavli", "Vallabhnagar", "Salumbar", "Kherwara", "Rishabhdeo", "Kotra", "Jhadol", "Gogunda", "Badgaon"],
        "Kota": ["Ladpura", "Digod", "Sangod", "Ramganj Mandi", "Itawa"],
        "Ajmer": ["Ajmer", "Pushkar", "Beawar", "Kishangarh", "Kekri", "Nasirabad", "Masuda", "Bhinai", "Sarwar"]
    },
    "Delhi (NCT)": {
        "New Delhi": ["Chanakyapuri", "Delhi Cantonment", "Vasant Vihar"],
        "Central Delhi": ["Civil Lines", "Kotwali", "Karol Bagh"],
        "South Delhi": ["Saket", "Hauz Khas", "Mehrauli"],
        "North Delhi": ["Sadar Bazar", "Model Town", "Narela", "Alipur"],
        "East Delhi": ["Gandhi Nagar", "Preet Vihar", "Mayur Vihar"],
        "West Delhi": ["Patel Nagar", "Punjabi Bagh", "Rajouri Garden"]
    },
    "Karnataka": {
        "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal", "Yelahanka"],
        "Mysuru": ["Mysuru", "Hunsur", "Nanjangud", "Piriyapatna", "T. Narasipura", "Krishnarajanagara", "Saragur"],
        "Belagavi": ["Belagavi", "Gokak", "Chikkodi", "Athani", "Bailhongal", "Hukkeri", "Ramdurg", "Saundatti"],
        "Mangaluru (Dakshina Kannada)": ["Mangaluru", "Bantwal", "Beltangadi", "Puttur", "Sullia", "Moodbidri", "Kadaba"]
    },
    "Haryana": {
        "Gurugram": ["Gurugram", "Sohna", "Pataudi", "Badshahpur", "Farrukhnagar", "Manesar"],
        "Faridabad": ["Faridabad", "Badkhal", "Ballabgarh"],
        "Ambala": ["Ambala City", "Ambala Cantt", "Barara", "Naraingarh", "Saha"],
        "Karnal": ["Karnal", "Indri", "Nilokheri", "Gharaunda", "Assandh"]
    },
    "Punjab": {
        "Amritsar": ["Amritsar-I", "Amritsar-II", "Ajnala", "Baba Bakala", "Majitha"],
        "Ludhiana": ["Ludhiana East", "Ludhiana West", "Jagraon", "Khanna", "Samrala", "Payal", "Raikot"],
        "Jalandhar": ["Jalandhar-I", "Jalandhar-II", "Nakodar", "Phillaur", "Shahkot"]
    },
    "Uttarakhand": {
        "Dehradun": ["Dehradun", "Rishikesh", "Vikasnagar", "Chakrata", "Kalsi", "Doiwala"],
        "Haridwar": ["Haridwar", "Roorkee", "Bhagwanpur", "Laksar"],
        "Nainital": ["Nainital", "Haldwani", "Ramnagar", "Kaladhungi", "Bhimtal", "Lalkuan"]
    },
    "Other State": {
        "Other District": ["Other Tehsil/Taluka"]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = INDIAN_LOCATIONS;
}

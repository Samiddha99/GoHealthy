#Create a common variable for state, district and zip

title = [("Mr","Mr"),("Mrs","Mrs"),("Ms","Ms")]

flor_list = ['Ground Flor', '1st Flor', '2nd Flor', '3rd Flor', '4th Flor', '5th Flor', '6th Flor', '7th Flor']
flor_ch = [('Ground Flor', 'Ground Flor'),
           ('1st Flor', '1st Flor'),
           ('2nd Flor', '2nd Flor'),
           ('3rd Flor', '3rd Flor'),
           ('4th Flor', '4th Flor'),
           ('5th Flor', '5th Flor'),
           ('6th Flor', '6th Flor'),
           ('7th Flor', '7th Flor')
       ]


language_ch = [
        ("Bengali", "Bengali"),
        ("English", "English"),
        ("Hindi", "Hindi"),
    ]


language_list = ['Bengali', 'English', 'Hindi']

room_list = ['General Ward', 'Women Ward', 'Men Ward', 'Child Ward', 'ICU']
room_list_ch = [
    ('General Ward', 'General Ward'),
    ('Women Ward', 'Women Ward'),
    ('Men Ward', 'Men Ward'),
    ('Child Ward', 'Child Ward'),
    ('ICU', 'ICU')
    ]


availability_ch = [
    ('Available', 'Available'),
    ('Used', 'Used'),
    ('Book', 'Book')
]
availability_list = ['Used', 'Available']

state_ch=['All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
          'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
          'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
          'West Bengal','Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
          'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry']

state_list=['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
          'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
          'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
          'West Bengal','Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
          'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry']

states = [
    ("Andhra Pradesh", "Andhra Pradesh"),
    ("Arunachal Pradesh", "Arunachal Pradesh"),
    ("Assam", "Assam"),
    ("Bihar", "Bihar"),
    ("Chhattisgarh", "Chhattisgarh"),
    ("Goa", "Goa"),
    ("Gujarat", "Gujarat"),
    ("Haryana", "Haryana"),
    ("Himachal Pradesh", "Himachal Pradesh"),
    ("Jharkhand", "Jharkhand"),
    ("Karnataka", "Karnataka"),
    ("Kerala", "Kerala"),
    ("Madhya Pradesh", "Madhya Pradesh"),
    ("Maharashtra", "Maharashtra"),
    ("Manipur", "Manipur"),
    ("Meghalaya", "Meghalaya"),
    ("Mizoram", "Mizoram"),
    ("Nagaland", "Nagaland"),
    ("Odisha", "Odisha"),
    ("Punjab", "Punjab"),
    ("Rajasthan", "Rajasthan"),
    ("Sikkim", "Sikkim"),
    ("Tamil Nadu", "Tamil Nadu"),
    ("Telangana", "Telangana"),
    ("Tripura", "Tripura"),
    ("Uttar Pradesh", "Uttar Pradesh"),
    ("Uttarakhand", "Uttarakhand"),
    ("West Bengal", "West Bengal"),

    ("Union Teritory","Union Teritory"),
    ("Andaman and Nicobar Islands", "Andaman and Nicobar Islands"),
    ("Chandigarh", "Chandigarh"),
    ("Dadra and Nagar Haveli and Daman and Diu", "Dadra and Nagar Haveli and Daman and Diu"),
    ("Delhi", "Delhi"),
    ("Jammu and Kashmir", "Jammu and Kashmir"),
    ("Ladakh", "Ladakh"),
    ("Lakshadweep", "Lakshadweep"),
    ("Puducherry", "Puducherry"),
  ]


def getDistrict(state):
    state = str(state)
    districts = None
    if state == "Andhra Pradesh":
        districts = ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'YSR Kadapa district', 'Krishna', 'Kurnool','Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari']
    elif state == "Arunachal Pradesh":
        districts = ['Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa-Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke-Kessang', 'Papum Pare', 'Shi-Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang']
    elif state == "Assam":
        districts = ['Bajali', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', '	Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', '	West Karbi Anglong']
    elif state == 'Bihar':
        districts = ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran (Motihari)', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur (Bhabua)', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger (Monghyr)', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia (Purnea)', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran',]
    elif state == 'Chhattisgarh':
        districts = ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada (South Bastar)', 'Dhamtari', 'Durg', 'Gariyaband', 'Janjgir-Champa', 'Jashpur', 'Kabirdham (Kawardha)', 'Kanker (North Bastar)', 'Kondagaon', 'Korba', 'Korea (Koriya)', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja',]
    elif state == 'Goa':
        districts = ['North Goa', 'South Goa',]
    elif state == 'Gujarat':
        districts = ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha (Palanpur)', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udepur', 'Dahod', 'Dangs (Ahwa)', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kachchh', 'Kheda (Nadiad)', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada (Rajpipla)', 'Navsari', 'Panchmahal (Godhra)', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha (Himmatnagar)', 'Surat', 'Surendranagar', 'Tapi (Vyara)', 'Vadodara', 'Valsad',]
    elif state == 'Haryana':
        districts = ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram (Gurgaon)', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar',]
    elif state == 'Himachal Pradesh':
        districts = ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul & Spiti', 'Mandi', 'Shimla', 'Sirmaur (Sirmour)', 'Solan', 'Una',]
    elif state == 'Jharkhand':
        districts = ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribag', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela-Kharsawan', 'Simdega', 'West Singhbhum',]
    elif state == 'Karnataka':
        districts = ['Bagalkot', 'Ballari (Bellary)', 'Belagavi (Belgaum)', 'Bengaluru (Bangalore) Rural', 'Bengaluru (Bangalore) Urban', 'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru (Chikmagalur)', 'Chitradurga', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi (Gulbarga)', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru (Mysore)', 'Raichur', 'Ramanagara', 'Shivamogga (Shimoga)', 'Tumakuru (Tumkur)', 'Udupi', 'Uttara Kannada (Karwar)', 'Vijayapura (Bijapur)', 'Yadgir',]
    elif state == 'Kerala':
        districts = ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad',]
    elif state == 'Madhya Pradesh':
        districts = ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha',]
    elif state == 'Maharashtra':
        districts = ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',]
    elif state == 'Manipur':
        districts = ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul',]
    elif state == 'Meghalaya':
        districts = ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills',]
    elif state == 'Mizoram':
        districts = ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Serchhip',]
    elif state == 'Nagaland':
        districts = ['Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto',]
    elif state == 'Odisha':
        districts = ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghapur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar (Keonjhar)', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Sonepur', 'Sundargarh',]
    elif state == 'Punjab':
        districts = ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Nawanshahr (Shahid Bhagat Singh Nagar)', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar (Mohali)', 'Sangrur', 'Tarn Taran',]
    elif state == 'Rajasthan':
        districts = ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur',]
    elif state == 'Sikkim':
        districts = ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim',]
    elif state == 'Tamil Nadu':
        districts = ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi (Tuticorin)', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar',]
    elif state == 'Telangana':
        districts = ['Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhoopalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal', 'Nagarkurnool', 'Nalgonda', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal (Rural)', 'Warangal (Urban)', 'Yadadri Bhuvanagiri',]
    elif state == 'Tripura':
        districts = ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura',]
    elif state == 'Uttar Pradesh':
        districts = ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi (Chatrapati Sahuji Mahraj Nagar)', 'Amroha (J.P. Nagar)', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur (Panchsheel Nagar)', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kanshiram Nagar (Kasganj)', 'Kaushambi', 'Kushinagar (Padrauna)', 'Lakhimpur - Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'RaeBareli', 'Rampur', 'Saharanpur', 'Sambhal (Bhim Nagar)', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamali (Prabuddh Nagar)', 'Shravasti', 'Siddharth Nagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi',]
    elif state == 'Uttarakhand':
        districts = ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi',]
    elif state == 'West Bengal':
        districts = ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur (South Dinajpur)', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Medinipur (West Medinipur)', 'Paschim (West) Burdwan (Bardhaman)', 'Purba Burdwan (Bardhaman)', 'Purba Medinipur (East Medinipur)', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur (North Dinajpur)',]
    elif state == 'Andaman and Nicobar Islands':
        districts = ['Nicobar', 'North and Middle Andaman', 'South Andaman',]
    elif state == 'Chandigarh':
        districts = ['Chandigarh',]
    elif state == 'Dadra and Nagar Haveli and Daman and Diu':
        districts = ['Daman', 'Diu',]
    elif state == 'Delhi':
        districts = ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi',]
    elif state == 'Jammu and Kashmir':
        districts = ['Anantnag', 'Bandipore', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur',]
    elif state == 'Ladakh':
        districts = ['Kargil', 'Leh',]
    elif state == 'Lakshadweep':
        districts = ['Lakshadweep',]
    elif state == 'Puducherry':
        districts = ['Karaikal', 'Mahe', 'Puducherry', 'Yanam',]
    else:
        districts = []
    return districts

#Hospital Type

type_ch = ['Government', 'Private']
Type_choise = (
    ("Government", "Government"),
    ("Private", "Private"),
)



group_ch = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
blood_groups = [
    ("A+", "A+"),
    ("A-", "A-"),
    ("B+", "B+"),
    ("B-", "B-"),
    ("O+", "O+"),
    ("O-", "O-"),
    ("AB+", "AB+"),
    ("AB-", "AB-")
]

id_type = [
    ("Aadhaar", "Aadhaar"),
    ("Voter Card", "Voter Card"),
    ("PAN", "PAN"),
    ("Doctor's Registration", "Doctor's Registration"),
]

id_list = ['Aadhaar', 'Voter Card', 'PAN']

gender_ch = [
    ('Male','Male'),
    ('Female','Female'),
    ('Other', 'Other'),
    ('I not prefered to say', 'I not prefered to say')
]


doctor_degree = [
    "MBBS (Bachelor of Medicine and Bachelor of Surgery)",
    "BAMS (Bachelor of Ayurvedic Medicine and Surgery)",
    "BHMS (Bachelor of Homeopathic Medicine & Surgery)",
    "BDS (Bachelor of Dental Sciences)",
    "BUMS (Bachelor in Unani Medicine and Surgery)",
    "BOT (Bachelor of Occupational Therapy)",
    "BRT (Bachelor of Respiratory Therapy)",
    "BND (Bachelor of Science in Nutrition and Dietetics)",
    "DHMS (Diploma in Homeopathic Medicine & Surgery)",
    "MD (Doctor of Medicine)",
    "MS (Masters of Surgery)",
    "DNB (Diplomate of National Board)",
    "D.M (Super Specialty degree in medicine)",
    "M.Ch (Super Specialty degree in surgery)",
    "B.V.Sc & AH (Bachelor of Veterinary Sciences & Animal Husbandry)",
    ]

MD = [
    "Aerospace Medicine",
    "Anatomy",
    "Anaesthesiology",
    "Biochemistry",
    "Biophysics",
    "Community Health",
    "Dermatology",
    "Emergency Medicine",
    "Family Medicine",
    "Forensic Medicine",
    "General Medicine",
    "Geriatrics",
    "Health Administration",
    "Hospital Administration",
    "Immunohematology",
    "Infectious Diseases",
    "Leprosy",
    "Marine Medicine",
    "Medical Genetics",
    "Microbiology",
    "Nuclear Medicine",
    "Paediatrics",
    "Palliative Medicine",
    "Pathology",
    "Pharmacology",
    "Psychiatry",
    "Physical Medicine and Rehabilitation",
    "Physiology",
    "Preventive and Social Medicine",
    "Pulmonary Medicine",
    "Radio-Diagnosis",
    "Radio-Therapy",
    "Tuberculosis and Respiratory diseases",
    "Emergency and Critical care",
    "Nuclear Medicine",
    "Sports Medicine",
    "Transfusion Medicine",
    "Skin and Vereral diseases",
    "Tropical Medicine",
    "Venereology",
]

MS = [
    "Ear, Nose and Throat (ENT)",
    "General Surgery",
    "Ophthalmology",
    "Orthopaedics",
    "Otorhinolaryngology",
    "Obstetrics and Gynaecology",
    "Dermatology",
    "Venerology",
    "Leprosy",
    "Traumatology & Surgery"
]

DNB = [
    "Anaesthesiology",
    "Anatomy",
    "Biochemistry",
    "Cardio-Thoracic Surgery",
    "Dermatology and Venereology",
    "Emergency Medicine",
    "Ear, Nose and Throat (ENT)",
    "Family Medicine",
    "Field Epidemiology",
    "Forensic Medicine",
    "General Medicine",
    "General Surgery",
    "Health Administration",
    "Immunohematology and Transfusion Medicine",
    "Maternal and Child Health",
    "Microbiology",
    "Neuro Surgery"
    "Nuclear Medicine",
    "Obstetric and Gynecology",
    "Ophthalmology",
    "Orthopaedic Surgery",
    "Oto-Rhino Laryngology",
    "Paediatrics",
    "Pathology",
    "Pharmacology",
    "Physical Medicine and Rehabilitation",
    "Physiology",
    "Psychiatry",
    "Radio-Diagnosis",
    "Radio-Therapy",
    "Respiratory diseases",
    "Rural Surgery",
    "Social and Preventive Medicine",
]

DM = [
    "Psychiatry",
    "Cardiac-Anaesthesiology",
    "Cardiology",
    "Haematology",
    "Pharmacology",
    "Anaesthesiology, Pain Medicine and Critical Care",
    "Endocrinology",
    "Gastroenterology",
    "Medicine and Microbiology",
    "Paediatrics",
    "Nephrology",
    "Neuro-Anaesthesiology and Critical Care",
    "Neurology",
    "Onco-Anesthesiology and Palliative Medicine",
    "Cardiology",
    "Pulmonary and Sleep disorders",
    "Obstetrics and Gynecology",
    "Nuclear Medicine",
    "Cardiac-Radiology",
]

Mch = [
    "Surgery",
    "Cardiothoracic and Vascular Surgery",
    "Gastrointestinal Surgery",
    "Obstetrics and Gynaecology",
    "Ear, Nose and Throat (ENT)",
    "Neuro Surgery",
    "Pediatric Surgery",
    "Plastic and Reconstructive Surgery",
    "Surgical Oncology",
    "Surgery Trauma Centre",
    "Urology",
]
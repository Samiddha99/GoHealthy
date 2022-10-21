from .models import *
import traceback
from .choice import *

def addStates():
    try:
        state = "Andhra Pradesh"
        districts = ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'YSR Kadapa district', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari']
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = "Arunachal Pradesh"
        districts = ['Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa-Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke-Kessang', 'Papum Pare', 'Shi-Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang']
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = "Assam"
        districts = ['Bajali', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', '	Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', '	West Karbi Anglong']
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Bihar'
        districts = ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran (Motihari)', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur (Bhabua)', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger (Monghyr)', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia (Purnea)', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Chhattisgarh'
        districts = ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada (South Bastar)', 'Dhamtari', 'Durg', 'Gariyaband', 'Janjgir-Champa', 'Jashpur', 'Kabirdham (Kawardha)', 'Kanker (North Bastar)', 'Kondagaon', 'Korba', 'Korea (Koriya)', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Goa'
        districts = ['North Goa', 'South Goa', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Gujarat'
        districts = ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha (Palanpur)', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udepur', 'Dahod', 'Dangs (Ahwa)', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kachchh', 'Kheda (Nadiad)', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada (Rajpipla)', 'Navsari', 'Panchmahal (Godhra)', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha (Himmatnagar)', 'Surat', 'Surendranagar', 'Tapi (Vyara)', 'Vadodara', 'Valsad', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Haryana'
        districts = ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram (Gurgaon)', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Himachal Pradesh'
        districts = ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul & Spiti', 'Mandi', 'Shimla', 'Sirmaur (Sirmour)', 'Solan', 'Una', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Jharkhand'
        districts = ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribag', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela-Kharsawan', 'Simdega', 'West Singhbhum', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Karnataka'
        districts = ['Bagalkot', 'Ballari (Bellary)', 'Belagavi (Belgaum)', 'Bengaluru (Bangalore) Rural', 'Bengaluru (Bangalore) Urban', 'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru (Chikmagalur)', 'Chitradurga', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi (Gulbarga)', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru (Mysore)', 'Raichur', 'Ramanagara', 'Shivamogga (Shimoga)', 'Tumakuru (Tumkur)', 'Udupi', 'Uttara Kannada (Karwar)', 'Vijayapura (Bijapur)', 'Yadgir', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Kerala'
        districts = ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Madhya Pradesh'
        districts = ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Maharashtra'
        districts = ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Manipur'
        districts = ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Meghalaya'
        districts = ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Mizoram'
        districts = ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Serchhip', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Nagaland'
        districts = ['Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Odisha'
        districts = ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghapur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar (Keonjhar)', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Sonepur', 'Sundargarh', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Punjab'
        districts = ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Nawanshahr (Shahid Bhagat Singh Nagar)', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar (Mohali)', 'Sangrur', 'Tarn Taran', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Rajasthan'
        districts = ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Sikkim'
        districts = ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Tamil Nadu'
        districts = ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi (Tuticorin)', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Telangana'
        districts = ['Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhoopalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal', 'Nagarkurnool', 'Nalgonda', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal (Rural)', 'Warangal (Urban)', 'Yadadri Bhuvanagiri', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Tripura'
        districts = ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Uttar Pradesh'
        districts = ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi (Chatrapati Sahuji Mahraj Nagar)', 'Amroha (J.P. Nagar)', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur (Panchsheel Nagar)', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kanshiram Nagar (Kasganj)', 'Kaushambi', 'Kushinagar (Padrauna)', 'Lakhimpur - Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'RaeBareli', 'Rampur', 'Saharanpur', 'Sambhal (Bhim Nagar)', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamali (Prabuddh Nagar)', 'Shravasti', 'Siddharth Nagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Uttarakhand'
        districts = ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'West Bengal'
        districts = ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur (South Dinajpur)', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Medinipur (West Medinipur)', 'Paschim (West) Burdwan (Bardhaman)', 'Purba Burdwan (Bardhaman)', 'Purba Medinipur (East Medinipur)', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur (North Dinajpur)', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=False).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Andaman & Nicobar'
        districts = ['Nicobar', 'North and Middle Andaman', 'South Andaman', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=True).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Chandigarh'
        districts = ['Chandigarh', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=True).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Dadra & Nagar Haveli and Daman & Diu'
        districts = ['Daman', 'Diu', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=True).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Delhi'
        districts = ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=True).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Jammu & Kashmir'
        districts = ['Anantnag', 'Bandipore', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=True).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Ladakh'
        districts = ['Kargil', 'Leh', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=True).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Lakshadweep'
        districts = ['Lakshadweep', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=True).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()

        state = 'Pondicherry'
        districts = ['Karaikal', 'Mahe', 'Puducherry', 'Yanam', ]
        if States.objects.filter(Name=state).exists() == False:
            States(Name=state, Is_Union_Territory=True).save()
        state = States.objects.filter(Name=state).first()
        for dis in districts:
            if Districts.objects.filter(Name=dis, state=state).exists() == False:
                Districts(Name=dis, state=state).save()
    except Exception as e:
        traceback.print_exc()
        print('\n\n')
    finally:
        return True



def addDegrees():
    try:
        degree = "MBBS (Bachelor of Medicine and Bachelor of Surgery)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "BAMS (Bachelor of Ayurvedic Medicine and Surgery)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "BHMS (Bachelor of Homeopathic Medicine & Surgery)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "BDS (Bachelor of Dental Sciences)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "BUMS (Bachelor in Unani Medicine and Surgery)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "BOT (Bachelor of Occupational Therapy)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "BRT (Bachelor of Respiratory Therapy)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "BND (Bachelor of Science in Nutrition and Dietetics)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "DHMS (Diploma in Homeopathic Medicine & Surgery)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "B.V.Sc & AH (Bachelor of Veterinary Sciences & Animal Husbandry)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
            degree = Degrees.objects.get(Degree=degree)
            Specialities(Speciality='N/A', Degree=degree).save()

        degree = "MD (Doctor of Medicine)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
        degree = Degrees.objects.filter(Degree=degree).first()
        spl =["Aerospace Medicine", "Anatomy", "Anaesthesiology", "Biochemistry", "Biophysics", "Community Health", "Dermatology", "Emergency Medicine", "Family Medicine", "Forensic Medicine", "General Medicine", "Geriatrics", "Health Administration", "Hospital Administration", "Immunohematology", "Infectious Diseases", "Leprosy", "Marine Medicine", "Medical Genetics", "Microbiology", "Nuclear Medicine", "Paediatrics", "Palliative Medicine", "Pathology", "Pharmacology", "Psychiatry", "Physical Medicine and Rehabilitation", "Physiology", "Preventive and Social Medicine", "Pulmonary Medicine", "Radio-Diagnosis", "Radio-Therapy", "Tuberculosis and Respiratory diseases", "Emergency and Critical care", "Nuclear Medicine", "Sports Medicine", "Transfusion Medicine", "Skin and Vereral diseases", "Tropical Medicine", "Venereology"]
        for s in spl:
            if Specialities.objects.filter(Speciality=s, Degree=degree).exists() == False:
                Specialities(Speciality=s, Degree=degree).save()

        degree = "MS (Masters of Surgery)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
        degree = Degrees.objects.filter(Degree=degree).first()
        spl = ["Ear, Nose and Throat (ENT)", "General Surgery", "Ophthalmology", "Orthopaedics", "Otorhinolaryngology", "Obstetrics and Gynaecology", "Dermatology", "Venereology", "Leprosy", "Traumatology & Surgery"]
        for s in spl:
            if Specialities.objects.filter(Speciality=s, Degree=degree).exists() == False:
                Specialities(Speciality=s, Degree=degree).save()

        degree = "DNB (Diplomate of National Board)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
        degree = Degrees.objects.filter(Degree=degree).first()
        spl = ["Anaesthesiology", "Anatomy", "Biochemistry", "Cardio-Thoracic Surgery", "Dermatology and Venereology", "Emergency Medicine", "Ear, Nose and Throat (ENT)", "Family Medicine", "Field Epidemiology", "Forensic Medicine", "General Medicine", "General Surgery", "Health Administration", "Immunohematology and Transfusion Medicine", "Maternal and Child Health", "Microbiology", "Neuro SurgeryNuclear Medicine", "Obstetric and Gynecology", "Ophthalmology", "Orthopaedic Surgery", "Oto-Rhino Laryngology", "Paediatrics", "Pathology", "Pharmacology", "Physical Medicine and Rehabilitation", "Physiology", "Psychiatry", "Radio-Diagnosis", "Radio-Therapy", "Respiratory diseases", "Rural Surgery", "Social and Preventive Medicine"]
        for s in spl:
            if Specialities.objects.filter(Speciality=s, Degree=degree).exists() == False:
                Specialities(Speciality=s, Degree=degree).save()

        degree = "D.M (Super Specialty degree in medicine)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
        degree = Degrees.objects.filter(Degree=degree).first()
        spl = ["Psychiatry", "Cardiac-Anaesthesiology", "Cardiology", "Haematology", "Pharmacology", "Anaesthesiology, Pain Medicine and Critical Care", "Endocrinology", "Gastroenterology", "Medicine and Microbiology", "Paediatrics", "Nephrology", "Neuro-Anaesthesiology and Critical Care", "Neurology", "Onco-Anesthesiology and Palliative Medicine", "Cardiology", "Pulmonary and Sleep disorders", "Obstetrics and Gynecology", "Nuclear Medicine", "Cardiac-Radiology"]
        for s in spl:
            if Specialities.objects.filter(Speciality=s, Degree=degree).exists() == False:
                Specialities(Speciality=s, Degree=degree).save()

        degree = "M.Ch (Super Specialty degree in surgery)"
        if Degrees.objects.filter(Degree=degree).exists() == False:
            Degrees(Degree=degree).save()
        degree = Degrees.objects.filter(Degree=degree).first()
        spl = ["Surgery", "Cardiothoracic and Vascular Surgery", "Gastrointestinal Surgery", "Obstetrics and Gynaecology", "Ear, Nose and Throat (ENT)", "Neuro Surgery", "Pediatric Surgery", "Plastic and Reconstructive Surgery", "Surgical Oncology", "Surgery Trauma Centre", "Urology"]
        for s in spl:
            if Specialities.objects.filter(Speciality=s, Degree=degree).exists() == False:
                Specialities(Speciality=s, Degree=degree).save()
    except Exception as e:
        traceback.print_exc()
        print('\n\n')
    finally:
        return True


def addLanguages():
    language_choice = [
        ("English", "English"),
        ("Hindi", "हिंदी"),
        ("Assamese", "অসমীয়া"),
        ("Bengali", "বাংলা"),
        ("Gujarati", "ગુજરાતી"),
        ("Kannada", "ಕನ್ನಡ"),
        ("Maithili", "मैथिली"),
        ("Malayalam", "മലയാളം"),
        ("Marathi", "मराठी"),
        ("Nepali", "नेपाली"),
        ("Odia", "ଓଡ଼ିଆ"),
        ("Punjabi", "ਪੰਜਾਬੀ"),
        ("Sanskrit", "संस्कृत"),
        ("Santhali", "ᱥᱟᱱᱛᱟᱲᱤ সাওঁতালী"),
        ("Sindhi", "सिन्धी ਸਿੰਧੀ"),
        ("Tamil", "தமிழ்"),
        ("Telugu", "తెలుగు"),
        ("Urdu", "اُردُو")
    ]
    for lang in language_choice:
        try:
            place_top = False
            if lang[0] == 'English' or lang[0] == 'Hindi':
                place_top = True
            Languages.objects.get_or_create(Language=lang[0], Local_Script=lang[1], place_at_top=place_top)
        except Exception as e:
            print(e)


def addDepartments():
    departments = ["Emergency Department", "Trauma Care Center", "Casuality Department", "Physiology", "Anaesthesiology", "Dermatology", "Eye", "General Surgery", "Ophthalmology", "Otorhinolaryngology", "PMR (Physical Medicine & Rehabilitation)", "Radiodiagnosis", "Radiotherapy", "Dentistry", "General Medicine", "Obstetrics & Gynaecology", "Orthopaedics", "Paediatrics", "Psychiatry", "Respiratory Medicine", "Plastic Surgery", "Urology", "Neurosurgery", "CTVS (Cardiothoracic and Vascular Surgery)"]
    for dept in departments:
        try:
            HospitalDepartment.objects.get_or_create(department=dept)
        except Exception as e:
            print(e)


def addSomeCommonDisease():
    disease_list = [('Stroke', 'General Medicine'),
                    ('Heart Attack', 'General Medicine'),
                    ('Breathing Problem', 'General Medicine'),
                    ('Fever', 'General Medicine'),
                    ('Diarrhea', 'General Medicine'),
                    ('Injured', "Trauma Care Center"),
                    ("Snake's Bit", "Emergency Department"),
                    ("Animal's Bite", "Emergency Department"),
                    ("Insect's Bite", "Emergency Department"),
                    ("Fire Burn", "Trauma Care Center"),
                    ('Surgery', "General Surgery"),
                    ('Pregnancy', "Obstetrics & Gynaecology"),
                    ("Eye's Problem", "Eye"),
                    ("Bone Broke", "Orthopaedics")
                ]
    for d in disease_list:
        try:
            dept = HospitalDepartment.objects.get_or_create(department=d[1])[0]
            SomeCommonDisease.objects.get_or_create(Disease=d[0], Concerned_Department=dept)
        except Exception as e:
            print(e)


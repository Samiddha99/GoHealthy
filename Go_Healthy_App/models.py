from django.db import models
from django.conf import settings
from django.db.models import Model, IntegerField
from embed_video.fields import EmbedVideoField
from .validators import validate_file_extension
from django.forms import ModelForm
from django.utils import timezone
from datetime import *
from .choice import *
import django
from datetime import datetime, timedelta
#from geoposition.fields import GeopositionField
#from django.contrib.gis.db import models
from django.contrib.auth.models import User, AbstractUser

user_type_ch = [('Normal','Normal'), ('Hospital', 'Hospital'), ('Doctor', 'Doctor'), ('Blood Donor', 'Blood Donor'), ('Admin', 'Admin'), ('Blood Donor & Doctor', 'Blood Donor & Doctor')]


# Create your models here.
class Users(AbstractUser):
    pass
    User_Type = models.CharField(max_length=20, choices=user_type_ch)
    is_verified = models.BooleanField(default=False)
    is_book_allow = models.BooleanField(default=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(default=django.utils.timezone.now)

    def __str__(self):
        return self.username

class Admin(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, max_length=20, unique=True)
    Name = models.CharField(max_length=100)
    Gender = models.CharField(max_length=30, choices=gender_ch)
    ID_Type = models.CharField(max_length=100, choices=id_type, default='Aadhaar')
    ID_Number = models.CharField(max_length=100, default='')
    Contact = models.CharField(max_length=10)
    Address = models.TextField()
    State = models.CharField(max_length=100, choices=states)
    City = models.CharField(max_length=200, default="")
    Subdivision = models.CharField(max_length=100)
    District = models.CharField(max_length=100)
    Pin = models.CharField(max_length=6)
    Image = models.ImageField(upload_to='images/adminuser users/')
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )

class NormalUser(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, max_length=20, unique=True)
    Name = models.CharField(max_length=100)
    Gender = models.CharField(max_length=30, choices=gender_ch)
    ID_Type = models.CharField(max_length=100, choices=id_type, default='Aadhaar')
    ID_Number = models.CharField(max_length=100, default='')
    Contact = models.CharField(max_length=10)
    Address = models.TextField()
    State = models.CharField(max_length=100, choices=states)
    City = models.CharField(max_length=200, default="")
    Subdivision = models.CharField(max_length=100)
    District = models.CharField(max_length=100)
    Pin = models.CharField(max_length=6)
    Image = models.ImageField(upload_to='images/normal users/')
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )

    def __str__(self):
        return self.Name

antivenom_ch = [('Yes','Yes'),('No','No')]
class Hospital(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, max_length=20, unique=True)
    Name = models.CharField(max_length=100)
    Hospital_Id = models.CharField(max_length=5, primary_key=True, unique=True)
    Type = models.CharField(max_length=100, choices=Type_choise)
    Contact = models.CharField(max_length=10)
    Address = models.TextField()
    State = models.CharField(max_length=100, choices=states)
    City = models.CharField(max_length=200, default="")
    Subdivision = models.CharField(max_length=100)
    District = models.CharField(max_length=100)
    Pin = models.CharField(max_length=6)
    Image = models.ImageField(upload_to='images/hospitals/')
    Has_Antivenom = models.CharField(max_length=10, choices=antivenom_ch, default='No')
    Location = models.URLField()
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )

    class Meta:
        ordering = ['State', 'District', 'Subdivision', 'Type', 'Name']

    def __str__(self):
        return self.Name


class Doctor(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, max_length=20, unique=True)
    Name = models.CharField(max_length=100)
    Registration_Number = models.CharField(max_length=50, primary_key=True, unique=True)
    Degree = models.CharField(max_length=100, default='MBBS')
    Gender = models.CharField(max_length=30, choices=gender_ch)
    Blood_Group = models.CharField(max_length=20, choices=blood_groups, default='')
    Special = models.CharField(max_length=100)
    Contact = models.CharField(max_length=10)
    Address = models.TextField()
    State = models.CharField(max_length=100, choices=states)
    City = models.CharField(max_length=200, default="")
    Subdivision = models.CharField(max_length=100)
    District = models.CharField(max_length=100)
    Pin = models.CharField(max_length=6)
    Image = models.ImageField(upload_to='images/doctors/')
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )

    class Meta:
        ordering = ['State', 'District', 'Subdivision', 'Special', 'Name']

    def __str__(self):
        return self.Name


class Blood_Donar(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, max_length=20, unique=True)
    Name = models.CharField(max_length=100)
    Gender = models.CharField(max_length=30, choices=gender_ch)
    Blood_Group = models.CharField(max_length=20, choices=blood_groups)
    Date_of_Birth = models.DateField(default=date.today, blank=True, null=True)
    Contact = models.CharField(max_length=10)
    ID_Type = models.CharField(max_length=100, choices=id_type)
    ID_Number = models.CharField(max_length=100,)
    Address = models.TextField()
    State = models.CharField(max_length=100, choices=states)
    City = models.CharField(max_length=200, default="")
    Subdivision = models.CharField(max_length=100)
    District = models.CharField(max_length=100, )
    Pin = models.CharField(max_length=6, )
    Image = models.ImageField(upload_to='images/blood donors/')
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )

    class Meta:
        ordering = ['State', 'District', 'Subdivision', 'Name', 'Blood_Group']

    def __str__(self):
        return self.Name


class BedNo(models.Model):
    Hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    Bed_No = models.CharField(max_length=5)
    Flor = models.CharField(max_length=50, choices=flor_ch)
    Room = models.CharField(max_length=100, choices=room_list_ch)
    Building = models.CharField(max_length=100)
    Availability = models.CharField(max_length=50, choices=availability_ch, default='Available')
    Book_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True)
    Booking_Id = models.CharField(max_length=10, blank=True, null=True)
    Book_Expire = models.DateTimeField(default=django.utils.timezone.now)

    class Meta:
        ordering = ['Room', 'Bed_No', 'Building', 'Flor']

    def __str__(self):
        h= str(self.Hospital)
        bed = str(self.Bed_No)
        f = str(self.Flor)
        r = str(self.Room)
        b = str(self.Building)
        ret = ""+h+", Bed No: "+bed+", Flor: "+f+", Room: "+r+", Building: "+b+""
        return ret

class BedRemove(models.Model):
    Hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    Bed = models.ForeignKey(BedNo, on_delete=models.CASCADE, null=True, blank=True)



class FirstaidPhoto(models.Model):
    Name = models.CharField(max_length=500)
    Upload_Photo = models.ImageField(upload_to='first aid/images/', null=True)
    Language = models.CharField(max_length=50, choices=language_ch, default='')

    class Meta:
        ordering = ['Name']


class FirstaidVideo(models.Model):
    Name = models.CharField(max_length=500)
    Video = models.FileField(upload_to="first aid/videos/", validators=[validate_file_extension])
    Language = models.CharField(max_length=50, choices=language_ch, default='')


complaint_status_ch = [('Pending','Pending'),('Processing','Processing'),('Resolved','Resolved')]
class complaint(models.Model):
    Complain_Id = models.CharField(max_length=7, primary_key=True, unique=True)
    Name = models.CharField(max_length=100)
    Email = models.EmailField(max_length=100)
    Phone = models.CharField(max_length=10)
    State = models.CharField(max_length=100)
    Address = models.TextField()
    District = models.CharField(max_length=100)
    Subdivision = models.CharField(max_length=100, default="")
    City = models.CharField(max_length=100)
    Pin = models.CharField(max_length=6)
    Attachment = models.FileField(null=True, blank=True, upload_to='documents\complaint', help_text='If you have any document or proof regarding your complaint, then please attach it.')
    Subject = models.CharField(max_length=100, default='')
    Complain = models.TextField()
    Status = models.CharField(max_length=50, choices=complaint_status_ch, default='Pending')
    Reply = models.TextField(default='N/A')
    Complaint_Time = models.DateTimeField(auto_now_add=True,)


class ContactUs(models.Model):  # For ContactUs Form
    Name = models.CharField(max_length=50)
    Phone = models.CharField(max_length=10)
    Email = models.EmailField(max_length=100)
    Message = models.TextField()
    Contact_Time = models.DateTimeField(auto_now_add=True, )


bed_book_status = [("Not Admit Still Now", "Not Admit Still Now"),("Admited", "Admitted"), ("Released", "Released"), ('Expired', 'Expired')]
bookBy_ch = [("User", "User"),("Hospital Authority","Hospital Authority")]

class Bed_Book(models.Model):
    Booking_ID = models.CharField(auto_created=True, max_length=10, primary_key=True, unique=True,)
    user = models.ForeignKey(Users, on_delete=models.DO_NOTHING, max_length=20, null=True)
    Booked_By = models.CharField(max_length=50, choices=bookBy_ch, default='User')
    Disease = models.CharField(max_length=500, null=True, blank=True)
    Hospital_Name = models.ForeignKey(Hospital, max_length=100, on_delete=models.CASCADE)
    Bed_No = models.ForeignKey(BedNo, on_delete=models.CASCADE, null=True, blank=True)
    Patient_Name = models.CharField(max_length=100)
    Email = models.EmailField(max_length=100, null=True, blank=True)
    Mobile = models.CharField(max_length=10)
    Alternative_Mobile = models.CharField(max_length=10, null=True, blank=True)
    Age = models.IntegerField(default=0)
    Address = models.TextField()
    Subdivision = models.CharField(max_length=100, default="")
    State = models.CharField(max_length=200)
    District = models.CharField(max_length=100)
    Pin = models.CharField(max_length=6)
    Gender = models.CharField(max_length=20)
    Booking_Time = models.DateTimeField(auto_now_add=True, )
    Expire_Time = models.DateTimeField(default=django.utils.timezone.now)
    Admit_Time = models.DateTimeField(default=django.utils.timezone.now)
    Next_Time = models.DateTimeField(default=django.utils.timezone.now)
    Status = models.CharField(max_length=50, choices=bed_book_status, default='Not Admit Still Now')

    class Meta:
        ordering = ['Booking_Time',]


# Bed_Update_Auto()
# class ReadonlyMeta:
# readonly = ["Booking_ID", "Hospital_Name","Patient_Name", "Email", "Mobile","Alternative_Mobile", "Address", "State","District", "Pin", "Gender", "Booking_Time", "Expire_Time", "Hospital_Bed", "Hospital_Details"]


cat = [("Notification", "Notification"), ("News", "News"), ("Event", "Event")]


class Notification_Notice_and_Event(models.Model):
    Catagory = models.CharField(max_length=100, choices=cat)
    Name = models.CharField(max_length=500)
    File = models.FileField(upload_to="documents/Notice", )


class Emargency_Number(models.Model):
    Office = models.CharField(max_length=500)
    Title = models.CharField(max_length=10, choices=title)
    Person = models.CharField(max_length=500, blank=True)
    Person_Designation = models.CharField(max_length=500, blank=True)
    State = models.CharField(max_length=100, choices=states)
    District = models.CharField(max_length=100)
    Subdivision = models.CharField(max_length=200)
    Contact = models.CharField(max_length=13)
    Contact_1 = models.CharField(max_length=13, blank=True)
    Contact_2 = models.CharField(max_length=13, blank=True)
    Contact_3 = models.CharField(max_length=13, blank=True)
    Contact_4 = models.CharField(max_length=13, blank=True)
    Contact_5 = models.CharField(max_length=13, blank=True)

    class Meta:
        ordering = ['State', 'District', 'Subdivision', 'Office']

class DoctorUpgrade(models.Model):
    Request = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    From = models.CharField(max_length=50)
    To = models.CharField(max_length=50)


class Chat(models.Model):
    From = models.ForeignKey(Users, on_delete=models.SET_DEFAULT, default='This User Account has been deleted', related_name='From')
    To = models.ForeignKey(Users, on_delete=models.SET_DEFAULT, default='This User Account has been deleted', related_name='To')
    Message = models.TextField(null=True, blank=True, max_length=500, default='')
    Delivered = models.BooleanField(default=False, auto_created=False)
    Time = models.DateTimeField(auto_now_add=True, )
    Deleted = models.BooleanField(default=False)
    class Meta:
        ordering = ['Time',]

class OTP(models.Model):
    MobileOTP = models.CharField(max_length=6, default="000000")
    EmailOTP = models.CharField(max_length=6, default="000000")
    Mobile = models.CharField(max_length=10, null=True, blank=True)
    Email = models.EmailField(max_length=100, null=True, blank=True)
    Is_Verified = models.BooleanField(default=False)
    Expire_Time = models.DateTimeField(default=django.utils.timezone.now)


class ResetPasswordCode(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, max_length=20, unique=True)
    Code = models.CharField(max_length=20)
    Expire_Time = models.DateTimeField(default=django.utils.timezone.now)

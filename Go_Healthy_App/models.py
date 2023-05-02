from urllib import request
from django.core.cache import cache
from django.urls import reverse
from django.http import HttpRequest
from django.utils.cache import get_cache_key
from re import M
from django import utils
from django.conf import settings
from django.contrib.postgres.fields import HStoreField
from django.db import models, connection
from django.utils.text import slugify
from django.db.models import *
from django.db.models import Field
from django.contrib.admin.models import *
from django.db.models.fields import *
from django.contrib.postgres.fields import *
from embed_video.fields import EmbedVideoField
from constrainedfilefield.fields import ConstrainedFileField
from django.forms import ModelForm
import datetime
import django
import os
from django.db.models.signals import *
from django.dispatch.dispatcher import receiver
from django.utils import timezone as zonetime
import secrets
import string
import threading
import sys
from django_eventstream import send_event, get_current_event_id
#from geoposition.fields import GeopositionField
#from django.contrib.gis.db import models
from django.contrib.auth.models import *
from .validators import *
from .choice import *


def user_image_directory_path(instance, filename):
    now = zonetime.now()
    now = now.strftime("%d-%m-%Y_%H,%M,%S,%f")
    splittedFileNameByDot = str(filename).split(".")
    fileExtension = splittedFileNameByDot[-1]
    renamedFilename = "{0}.{1}".format(instance.Username.username, fileExtension)
    path = "images/User_Profile_Picture/{0}".format(renamedFilename)
    return path

def user_id_proof_directory_path(instance, filename):
    now = zonetime.now()
    now = now.strftime("%d-%m-%Y_%H,%M,%S,%f")
    splittedFileNameByDot = str(filename).split(".")
    fileExtension = splittedFileNameByDot[-1]
    renamedFilename = "{0}.{1}".format(instance.ID_Number, fileExtension)
    path = "documents/ID Proofs/{0}/{1}".format(instance.ID_Type, renamedFilename)
    return path

def registration_document_directory_path(instance, filename):
    now = zonetime.now()
    now = now.strftime("%d-%m-%Y_%H,%M,%S,%f")
    splittedFileNameByDot = str(filename).split(".")
    fileExtension = splittedFileNameByDot[-1]
    renamedFilename = "{0}-{1}_{2}.{3}".format(instance.Username.username, instance.Username.ID_Number, instance.Unique_Id, fileExtension)
    path = "documents/Registrations/{0}".format(renamedFilename)
    return path

def certificate_directory_path(instance, filename):
    now = zonetime.now()
    now = now.strftime("%d-%m-%Y_%H,%M,%S,%f")
    splittedFileNameByDot = str(filename).split(".")
    fileExtension = splittedFileNameByDot[-1]
    renamedFilename = "Certificate-{0}.{1}".format(instance.Certificate_Id, fileExtension)
    path = "documents/Certificates/{0}/{1}".format(instance.Certificate_issued_for, renamedFilename)
    return path


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager
    """
    def create_user(self, username, password, **extra_fields):
        """
        Create and save a User.
        """
        if not username:
            raise ValueError('The Username must be set')
        #email = self.normalize_email(extra_fields['email'])
        user = self.model(username = username, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_staffuser(self, username, password, **extra_fields):
        """
        Create and save a Staff User.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('User_Type', ['Site Admin'])

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Staffuser must have is_staff=True.')
        return self.create_user(username, password, **extra_fields)
    
    def create_superuser(self, username, password, **extra_fields):
        """
        Create and save a SuperUser.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('User_Type', ['Site Admin'])

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(username, password, **extra_fields)

# Create your models here.
class States(models.Model):
    Name = models.CharField(max_length=200, unique=True, verbose_name='State Name')
    Is_Union_Territory = models.BooleanField(default=False, verbose_name='Is Union Territory')

    class Meta:
        ordering = ['Is_Union_Territory', 'Name',]
        verbose_name_plural = 'States'
        indexes = [
            models.Index(fields=['Name', 'Is_Union_Territory'], name='state_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(States, self).save(*args, **kwargs)

    def __str__(self):
        return self.Name


class Districts(models.Model):
    Name = models.CharField(max_length=200, verbose_name='District Name')
    state = models.ForeignKey(States, on_delete=models.CASCADE, verbose_name='State', related_name='state_districts', related_query_name='state_district')

    class Meta:
        ordering = ['state', 'Name',]
        unique_together = [['Name', 'state']]
        verbose_name = 'District'
        verbose_name_plural = 'Districts'
        indexes = [
            models.Index(fields=['Name', 'state'], name='district_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(Districts, self).save(*args, **kwargs)

    def __str__(self):
        ret = str(self.state)+" - "+str(self.Name)
        return ret

class Degrees(models.Model):
    Degree = models.CharField(max_length=200, unique=True)
    class Meta:
        ordering = ['Degree',]
        verbose_name = 'Degree'
        verbose_name_plural = 'Degrees'
        indexes = [
            models.Index(fields=['Degree'], name='degree_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(Degrees, self).save(*args, **kwargs)

    def __str__(self):
        return self.Degree

class Specialities(models.Model):
    Degree = models.ForeignKey(Degrees, on_delete=models.CASCADE)
    Speciality = models.CharField(max_length=200,)
    class Meta:
        unique_together = [['Degree', 'Speciality']]
        ordering = ['Degree', 'Speciality']
        verbose_name = 'Speciality'
        verbose_name_plural = 'Specialities'
        indexes = [
            models.Index(fields=['Degree', 'Speciality'], name='speciality_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(Specialities, self).save(*args, **kwargs)

    def __str__(self):
        ret = str(self.Degree) + " - " + str(self.Speciality)
        return ret

class Languages(models.Model):
    Language = models.CharField(max_length=200, unique=True)
    Local_Script = models.CharField(max_length=1000)
    place_at_top = models.BooleanField(default=False)
    class Meta:
        unique_together = ['Language', 'Local_Script']
        ordering = [ '-place_at_top', 'Language',]
        verbose_name = 'Language'
        verbose_name_plural = 'Languages'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(Languages, self).save(*args, **kwargs)

    def __str__(self):
        return self.Language

class HospitalDepartment(models.Model):
    department = models.CharField(max_length=200, unique=True)

    class Meta:
        ordering = ['department',]
        verbose_name = 'Hospital Department'
        verbose_name_plural = 'Hospital Departments'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(HospitalDepartment, self).save(*args, **kwargs)

    def __str__(self):
        return self.department


class SomeCommonDisease(models.Model):
    Disease = models.CharField(max_length=200)
    Concerned_Department = models.ForeignKey(HospitalDepartment, on_delete=models.CASCADE, related_name='common_disease_departments', related_query_name='common_disease_department')
    
    class Meta:
        unique_together = ['Disease', 'Concerned_Department']
        ordering = ['Disease',]
        verbose_name = 'Some Common Disease'
        verbose_name_plural = 'Some Common Diseases'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(SomeCommonDisease, self).save(*args, **kwargs)

    def __str__(self):
        return self.Disease


class Users(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(max_length=100, unique=True, db_index=True)
    User_Type = ArrayField(base_field=models.CharField(max_length=300), validators=[check_user_type])
    Contact = models.CharField(max_length=10, unique=True, db_index=True, validators=[contact_validation])
    ID_Type = models.CharField(max_length=100, choices=id_type, null=True, blank=True)
    ID_Number = models.CharField(max_length=100, null=True, blank=True)
    display_profile_pic = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_book_allow = models.BooleanField(default=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(default=django.utils.timezone.now)
    last_update = models.DateTimeField(default=django.utils.timezone.now, )
    Is_in_Upgradation = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')
    is_staff = models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')
    is_superuser = models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')
    last_login = models.DateTimeField(blank=True, null=True, verbose_name='last login')
    last_login_details = HStoreField(blank=True, null=True)
    date_joined = models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')
    Registered = models.BooleanField(default=True)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email', 'User_Type', 'Contact', 'ID_Type', 'ID_Number', 'display_profile_pic', 'is_verified', 'is_book_allow', 'is_online', 'last_seen', 'last_update', 'Is_in_Upgradation']

    class Meta:
        # unique_together = [['ID_Type', 'ID_Number']]
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['username', 'email', 'Contact', 'User_Type', 'is_verified', 'is_active', 'is_book_allow'], name='user_index'),
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__last_login_details = self.last_login_details
        self.__is_verified = self.is_verified
        self.__is_book_allow = self.is_book_allow
        self.__Is_in_Upgradation = self.Is_in_Upgradation
        self.__is_active = self.is_active
        self.__is_staff = self.is_staff
        self.__last_login = self.last_login
        self.__is_superuser = self.is_superuser
    def save(self, *args, **kwargs):
        if (self.last_login_details != self.__last_login_details or self.is_verified != self.__is_verified or self.is_book_allow != self.__is_book_allow or self.Is_in_Upgradation != self.__Is_in_Upgradation or self.is_active != self.__is_active or self.is_staff != self.__is_staff or self.is_superuser != self.__is_superuser or self.last_login != self.__last_login): 
            self.last_update = self.last_update
        else:
            self.last_update = zonetime.now()
        self.full_clean(exclude=['last_login_details',]) # calls self.clean() as well cleans other fields
        super(Users, self).save(*args, **kwargs)

    def __str__(self):
        return self.username

class SiteAdmin(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, unique=True, related_name='user_admins')
    Name = models.CharField(max_length=100, validators=[name_validation])
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )
    class Meta:
        verbose_name = 'Administrator'
        verbose_name_plural = 'Administrators'
        indexes = [
            models.Index(fields=['Username', 'Name'], name='admin_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(SiteAdmin, self).save(*args, **kwargs)

class NormalUser(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, unique=True, related_name='user_normalusers')
    Name = models.CharField(max_length=100, validators=[name_validation, prefix_validation])
    Gender = models.CharField(max_length=30, choices=gender_ch)
    Permanent_Address = models.TextField(max_length=500)
    Permanent_State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='permanent_state_normalusers', related_query_name='permanent_state_normaluser')
    Permanent_City = models.CharField(max_length=200)
    Permanent_Subdivision = models.CharField(max_length=100)
    Permanent_District = models.ForeignKey(Districts, on_delete=models.CASCADE, related_name='permanent_district_normalusers')
    Permanent_Pin = models.CharField(max_length=6, validators=[only_numeric])
    Address = models.TextField(max_length=500)
    State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='current_state_normalusers', related_query_name='current_state_normaluser')
    City = models.CharField(max_length=200)
    Subdivision = models.CharField(max_length=100)
    District = models.ForeignKey(Districts, on_delete=models.CASCADE, related_name='current_district_normalusers')
    Pin = models.CharField(max_length=6, validators=[only_numeric])
    Image = models.ImageField(upload_to=user_image_directory_path, validators=[validate_image_type, validate_file_size,])
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )

    class Meta:
        verbose_name = 'Normal User'
        verbose_name_plural = 'Normal Users'
        indexes = [
            models.Index(fields=['Username', 'Name'], include=['Gender', 'Address', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Image'], name='normal_user_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(NormalUser, self).save(*args, **kwargs)

    def __str__(self):
        return self.Name



class Hospital(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, unique=True, related_name='user_hospitals', related_query_name="user_hospital")
    Auth_Key = models.CharField(max_length=40, unique=True, default='0', db_index=True)
    Name = models.CharField(max_length=500, validators=[office_name_validation])
    Unique_Id = models.CharField(max_length=7, unique=True, default='0', db_index=True)
    Emergency_Number = models.CharField(max_length=15, db_index=True, validators=[contact_validation])
    Toll_Free_Number = models.CharField(max_length=15, db_index=True, blank=True, null=True, validators=[contact_validation])
    Helpline_Number = models.CharField(max_length=15, db_index=True, blank=True, null=True, validators=[contact_validation])
    Contacts = ArrayField(base_field=models.CharField(max_length=15, blank=True, null=True, validators=[contact_validation]), blank=True, null=True)
    Type = models.CharField(max_length=100, choices=Type_choice)
    Ownership = models.CharField(max_length=100, choices=Ownership_choice)
    Address = models.TextField(max_length=500)
    State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='state_hospitals', related_query_name='state_hospital')
    City = models.CharField(max_length=200)
    Subdivision = models.CharField(max_length=100)
    District = models.ForeignKey(Districts, on_delete=models.CASCADE)
    Pin = models.CharField(max_length=6, validators=[only_numeric])
    Image = models.ImageField(upload_to=user_image_directory_path, validators=[validate_image_type, validate_file_size])
    Website = models.URLField(max_length=100, blank=True, null=True)
    Registration_Document = models.FileField(upload_to=registration_document_directory_path, validators=[validate_document_file_type, validate_file_size])
    Has_Antivenom = models.CharField(max_length=10, choices=antivenom_ch, default='No')
    Oxygen_Remaining_Time = models.IntegerField(default=0)
    Latitude = models.FloatField()
    Longitude = models.FloatField()
    Last_Update = models.DateTimeField(auto_now=True, )
    Created_at = models.DateTimeField(auto_now_add=True, )

    class Meta:
        ordering = ['Name',]
        verbose_name = 'Hospital'
        verbose_name_plural = 'Hospitals'
        indexes = [
            models.Index(fields=['Username', 'Auth_Key', 'Unique_Id', 'Name'], include=['Type', 'Address', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Image', 'Has_Antivenom', 'Oxygen_Remaining_Time', 'Latitude', 'Longitude'], name='hospital_index'),
        ]


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__original_Oxygen_Remaining_Time = self.Oxygen_Remaining_Time
    def save(self, *args, **kwargs):
        try:
            if self.Oxygen_Remaining_Time != self.__original_Oxygen_Remaining_Time:
                from .utils import fetchBed
                remain = self.Oxygen_Remaining_Time
                if self.Oxygen_Remaining_Time < 30:
                    BedNo.objects.filter(Hospital=self, Availability='Available', Support='With Oxygen').update(Availability='Not Available', Last_Update=zonetime.now())
                    fetchBed(Hospital.objects.filter(id=self.id))
                else:
                    BedNo.objects.filter(Hospital=self, Availability='Not Available', Support='With Oxygen').update(Availability='Available', Last_Update=zonetime.now())
                    fetchBed(Hospital.objects.filter(id=self.id))
                bedData = {
                    'id': self.id,
                    'Hospital_Id': self.Unique_Id,
                    'Oxygen_Remaining_Time': remain,
                    'OxygenUpdate': '1',
                }
                send_event('liveBed', 'message', bedData)
            self.__original_Oxygen_Remaining_Time = self.Oxygen_Remaining_Time
        except Exception as e:
            traceback.print_exc()
            print("\n\n")
        self.full_clean() # calls self.clean() as well cleans other fields
        super(Hospital, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('Go_Healthy_App:HospitalPage', kwargs={'id': self.Unique_Id})

    def __str__(self):
        return self.Name



class BloodBank(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='user_bloodbanks', related_query_name='user_bloodbank')
    Name = models.CharField(max_length=500, validators=[office_name_validation])
    Unique_Id = models.CharField(max_length=7, unique=True, default='0', db_index=True)
    Ownership = models.CharField(max_length=100, choices=Ownership_choice)
    Emergency_Number = models.CharField(max_length=15, db_index=True, validators=[contact_validation])
    Toll_Free_Number = models.CharField(max_length=15, db_index=True, blank=True, null=True, validators=[contact_validation])
    Helpline_Number = models.CharField(max_length=15, db_index=True, blank=True, null=True, validators=[contact_validation])
    Contacts = ArrayField(base_field=models.CharField(max_length=15, blank=True, null=True, validators=[contact_validation]), blank=True, null=True)
    Address = models.TextField(max_length=500)
    State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='state_bloodbanks', related_query_name='state_bloodbank')
    City = models.CharField(max_length=200)
    Subdivision = models.CharField(max_length=100)
    District = models.ForeignKey(Districts, on_delete=models.CASCADE)
    Pin = models.CharField(max_length=6, validators=[only_numeric])
    Blood_Availability = HStoreField()
    Website = models.URLField(max_length=100, blank=True, null=True)
    Registration_Document = models.FileField(upload_to=registration_document_directory_path, validators=[validate_document_file_type, validate_file_size])
    Latitude = models.FloatField()
    Longitude = models.FloatField()
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Changed = models.DateTimeField(auto_now=True, )
    Last_Update = models.DateTimeField(default=django.utils.timezone.now )
    
    class Meta:
        ordering = ['State', 'District', 'Subdivision', 'Name',]
        verbose_name = 'Blood Bank'
        verbose_name_plural = 'Blood Banks'
        indexes = [
            models.Index(fields=['Username', 'Name', 'Unique_Id'], include=['Ownership', 'Address', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Latitude', 'Longitude'], name='blood_bank_index'),
        ]

    def get_absolute_url(self):
        return reverse('Go_Healthy_App:BloodBankPage', kwargs={'id': self.Unique_Id,})
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__Blood_Availability = self.Blood_Availability
    def save(self, *args, **kwargs):
        if self.Blood_Availability != self.__Blood_Availability: 
            self.Last_Update = zonetime.now()
        self.full_clean(exclude=['Blood_Availability',]) # calls self.clean() as well cleans other fields
        super(BloodBank, self).save(*args, **kwargs)

    def __str__(self):
        return self.Name


class Disease(models.Model):
    Disease = models.CharField(max_length=500, unique=True)

    class Meta:
        ordering = ['Disease']
        verbose_name = "Disease"
        verbose_name_plural = "Diseases"
    
    def __str__(self):
        return self.Disease


class HospitalRoom(models.Model):
    Hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='hospital_rooms', related_query_name='hospital_room')
    Room = models.CharField(max_length=300)

    class Meta:
        unique_together = ['Hospital', 'Room']
        ordering = ['Hospital', 'Room']
        verbose_name = "Hospital's Room"
        verbose_name_plural = "Hospital's Rooms"

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(HospitalRoom, self).save(*args, **kwargs)

    def __str__(self):
        h = str(self.Hospital.Name)
        room = str(self.Room)
        ret = "" + h + ", Room: " + room
        return ret


class HospitalUnit(models.Model):
    Hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='hospital_units', related_query_name='hospital_unit')
    Unit = models.CharField(max_length=300)

    class Meta:
        unique_together = ['Hospital', 'Unit']
        ordering = ['Hospital', 'Unit']
        verbose_name = "Hospital's Unit"
        verbose_name_plural = "Hospital's Units"

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(HospitalUnit, self).save(*args, **kwargs)

    def __str__(self):
        h = str(self.Hospital.Name)
        unit = str(self.Unit)
        ret = "" + h + ", Unit: " + unit
        return ret


class HospitalBuilding(models.Model):
    Hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='hospital_buildings', related_query_name='hospital_building')
    Building = models.CharField(max_length=300)

    class Meta:
        unique_together = ['Hospital', 'Building']
        ordering = ['Hospital', 'Building']
        verbose_name = "Hospital's Building"
        verbose_name_plural = "Hospital's Buildings"

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(HospitalBuilding, self).save(*args, **kwargs)

    def __str__(self):
        ret = "" + str(self.Hospital.Name) + ", Room " + self.Building
        return ret


class BedNo(models.Model):
    Hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='hospital_beds', related_query_name='hospital_bed')
    Department = models.ForeignKey(HospitalDepartment, on_delete=models.CASCADE, related_name='department_beds', related_query_name='department_bed')
    Bed_No = models.CharField(max_length=5, null=True, blank=True)
    Floor = models.CharField(max_length=50, choices=floor_ch, null=True, blank=True)
    Ward = models.CharField(max_length=100, choices=ward_ch)
    Room = models.ForeignKey(HospitalRoom, on_delete=models.SET_NULL, null=True, blank=True, related_name='hospital_rooms', related_query_name='hospital_room')
    Unit = models.ForeignKey(HospitalUnit, on_delete=models.SET_NULL, null=True, blank=True, related_name='hospital_units', related_query_name='hospital_unit')
    Building = models.ForeignKey(HospitalBuilding, on_delete=models.SET_NULL, null=True, blank=True, related_name='hospital_buildings', related_query_name='hospital_building')
    Availability = models.CharField(max_length=50, choices=availability_ch, default='Available')
    Support = models.CharField(max_length=100, choices=bedSupportChoice)
    Book_by = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True)
    Booking_Id = models.CharField(max_length=30, blank=True, null=True)
    added_at = models.DateTimeField(auto_now_add=True)
    Last_Update = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['Hospital', 'Department', 'Bed_No', 'Floor', 'Ward', 'Room', 'Unit', 'Building', 'Support']
        ordering = ['Hospital', 'Department', 'Ward', 'Support', 'Room', 'Unit', 'Building', 'Floor', 'Bed_No']
        verbose_name = 'Bed'
        verbose_name_plural = 'Beds'
        indexes = [
            models.Index(fields=['Hospital', 'Department', 'Bed_No', 'Floor', 'Room', 'Ward', 'Building', 'Availability', 'Support', 'Last_Update'], include=['Book_by', 'Booking_Id'], name='bed_no_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(BedNo, self).save(*args, **kwargs)

    def __str__(self):
        h = str(self.Hospital.Name)
        bed = str(self.Bed_No)
        if self.Room is not None:
            room = str(self.Room.Room)
        else:
            room = 'N/A'
        floor = str(self.Floor)
        ward = str(self.Ward)
        building = str(self.Building)
        ret = "" + h + "Dept: " +self.Department.department+ ", BED NO: " + bed + ", WARD: " + ward + "ROOM: " + room + ", BUILDING: " + building + ", FLOOR: " + floor
        return ret

class BedRemoveRequests(models.Model):
    Bed = models.ForeignKey(BedNo, on_delete=models.CASCADE)
    Status = models.CharField(max_length=100, choices=bed_remove_status_ch, default='Pending')
    requested_at = models.DateTimeField(auto_now_add=True)
    status_change_at = models.DateTimeField(default=django.utils.timezone.now)

    class Meta:
        ordering = ['-requested_at']
        verbose_name = 'Bed Remove Request '
        verbose_name_plural = 'Bed Remove Requests'

    def validate_unique(self, exclude=[]):
        if BedRemoveRequests.objects.exclude(pk=self.pk).filter(Bed=self.Bed, Status='Pending').exists():
            raise ValidationError('Remove request for the bed already is in Pending status')
        super(BedRemoveRequests, self).validate_unique(exclude=exclude)

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(BedRemoveRequests, self).save(*args, **kwargs)


class PatientData(models.Model):
    Booking_ID = models.CharField(max_length=30, primary_key=True, unique=True,  db_index=True)
    Username = models.ForeignKey(Users, on_delete=models.CASCADE, null=True, blank=True, related_name='user_bedbooks', related_query_name='user_bedbook')
    Booked_By = models.CharField(max_length=50, choices=bookBy_ch, default='User')
    Disease = models.ForeignKey(Disease, on_delete=models.CASCADE, blank=True, null=True, related_name='disease_patientsData', related_query_name='disease_patientData')
    Hospital_Name = models.ForeignKey(Hospital, max_length=500, on_delete=models.CASCADE, related_name='hospital_patientsData', related_query_name="hospital_patientData")
    Bed_No = models.ForeignKey(BedNo, on_delete=models.SET_NULL, null=True, blank=True, related_name='bed_patientsData', related_query_name="bed_patientData")
    Patient_Name = models.CharField(max_length=100, validators=[name_validation])
    Email = models.EmailField(max_length=100, blank=True, null=True)
    Mobile = models.CharField(max_length=10,)
    Alternative_Mobile = models.CharField(max_length=10, blank=True, null=True, validators=[contact_validation])
    Age = models.CharField(max_length=20)
    Subdivision = models.CharField(max_length=100,)
    State = models.CharField(max_length=500)
    District = models.CharField(max_length=500)
    Pin = models.CharField(max_length=20)
    Gender = models.CharField(max_length=20)
    Booking_Time = models.DateTimeField(auto_now_add=True, )
    Expire_Time = models.DateTimeField(default=django.utils.timezone.now)
    Admit_Time = models.DateTimeField(default=django.utils.timezone.now)
    Status_Changed_At = models.DateTimeField(default=django.utils.timezone.now)
    Status = models.CharField(max_length=50, choices=patient_status_ch, default='Not Admit Still Now')
    QR = models.ImageField(upload_to='images/Bed_Book_QR/', validators=[validate_image_type])
    Is_Unknown = models.BooleanField(default=False)
    Is_Checked = models.BooleanField(default=False)
    When_Checked = models.DateTimeField(default=django.utils.timezone.now)

    class Meta:
        # constraints = [
        #     models.UniqueConstraint(fields=['Bed_No', 'Status'], condition=(Q(Status='Admitted') | Q(Status='Not Admit Still Now')), name='unique_bed_on_admit_or_not_admit_still_now'),
        #     models.UniqueConstraint(fields=['Username', 'Status'], condition=((Q(Status='Not Admit Still Now')) & (~Q(Username__User_Type__overlap=['Site Admin', 'Hospital', 'Blood Bank'])) ), name='one_user_one_pending_booking'),
        # ]
        get_latest_by = ['-Booking_Time']
        ordering = ['-Booking_Time', ]
        verbose_name = 'Patient Data'
        verbose_name_plural = 'Patient Data'
        indexes = [
            models.Index(fields=['Booking_ID', 'Username', 'Hospital_Name', 'Bed_No', 'Status'], include=['Booking_Time', 'Expire_Time', 'Admit_Time', 'Status_Changed_At'], name='bed_book_index'),
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__Status = self.Status
    def save(self, *args, **kwargs):
        if self.Status != self.__Status: 
            self.Status_Changed_At = zonetime.now()
        self.full_clean() # calls self.clean() as well cleans other fields
        super(PatientData, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('Go_Healthy_App:BookStatus', kwargs={'id': self.Booking_ID})

    def __str__(self):
        return self.Booking_ID


class Past_few_days_ReferredPatient(models.Manager):
    def get_queryset(self):
        last_hour = zonetime.now() - datetime.timedelta(days=3)
        return super().get_queryset().filter(ReferredDate__gte=last_hour)
class today_ReferredPatient(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(ReferredDate__date=zonetime.now().date())
class ReferredPatient(models.Model):
    Referral_Hospital_From = models.ForeignKey(Hospital, max_length=500, on_delete=models.CASCADE, null=True, blank=True, related_name='hospital_from_referredpatients', related_query_name='hospital_from_referredpatient')
    Referral_Hospital_To = models.ForeignKey(Hospital, max_length=500, on_delete=models.CASCADE, null=True, blank=True, related_name='hospital_to_referredpatients', related_query_name='hospital_to_referredpatient')
    Patient = models.ForeignKey(PatientData, max_length=100, on_delete=models.CASCADE, null=True, blank=True, related_name='patient_referredpatients', related_query_name='patient_referredpatient')
    Bed = models.ForeignKey(BedNo, max_length=100, on_delete=models.CASCADE, null=True, blank=True, related_name='bed_referredpatients', related_query_name='bed_referredpatient')
    is_action_took = models.BooleanField(default=True) #is referral hospital take any action for the referral
    Admit_Time = models.DateTimeField(default=django.utils.timezone.now, null=True, blank=True)
    ReferredDate = models.DateTimeField(auto_now_add=True, )

    objects = models.Manager()
    past_few_days_objects = Past_few_days_ReferredPatient()
    today_objects = today_ReferredPatient()

    class Meta:
        get_latest_by = ['-ReferredDate']
        ordering = ['-ReferredDate', ]
        verbose_name = 'Referred Patient'
        verbose_name_plural = 'Referred Patients'
        indexes = [
            models.Index(fields=['Referral_Hospital_From', 'Referral_Hospital_To', 'Patient', 'Bed'], include=['Referral_Hospital_From', 'Referral_Hospital_To', 'Patient', 'Bed'], name='referred_patient_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(ReferredPatient, self).save(*args, **kwargs)



class PatientShiftRecords(models.Model):
    patient = models.ForeignKey(PatientData, max_length=100, on_delete=models.CASCADE, related_name='shift_patients', related_query_name='shift_patient')
    shift_form = models.ForeignKey(BedNo, max_length=100, on_delete=models.CASCADE, null=True, blank=True, related_name='patient_shift_from_beds', related_query_name='patient_shift_from_bed')
    shift_to = models.ForeignKey(BedNo, max_length=100, on_delete=models.CASCADE, null=True, blank=True, related_name='patient_shift_to_beds', related_query_name='patient_shift_to_bed')
    hospital = models.ForeignKey(Hospital, max_length=500, on_delete=models.CASCADE, null=True, blank=True, related_name='hospital_patient_shifts', related_query_name='hospital_patient_shift')
    shifted_at = models.DateTimeField(auto_now_add=True, )

    class Meta:
        get_latest_by = ['-shifted_at']
        ordering = ['-shifted_at', ]
        verbose_name = 'Patient Shift Record'
        verbose_name_plural = 'Patient Shift Records'
        indexes = [
            models.Index(fields=['patient', 'shift_form', 'shift_to', 'hospital'], include=['patient', 'shift_form', 'shift_to', 'hospital'], name='patient_shift_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(PatientShiftRecords, self).save(*args, **kwargs)


class NonPending_Doctors(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(Pending_Upgradation=False)
class Pending_Doctors(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(Pending_Upgradation=True)
class Doctor(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, unique=True, related_name='user_doctors')
    Name = models.CharField(max_length=100, validators=[name_validation, prefix_validation])
    Degree = models.ForeignKey(Degrees, on_delete=models.CASCADE)
    Gender = models.CharField(max_length=30, choices=gender_ch)
    Blood_Group = models.CharField(max_length=50, choices=blood_groups)
    Special = models.ForeignKey(Specialities, on_delete=models.CASCADE)
    Permanent_Address = models.TextField(max_length=500)
    Permanent_State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='permanent_state_doctors', related_query_name='permanent_state_doctor')
    Permanent_City = models.CharField(max_length=200)
    Permanent_Subdivision = models.CharField(max_length=100)
    Permanent_District = models.ForeignKey(Districts, on_delete=models.CASCADE, related_name='permanent_district_doctors')
    Permanent_Pin = models.CharField(max_length=6, validators=[only_numeric])
    Address = models.TextField(max_length=500)
    State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='current_states_doctors', related_query_name='current_states_doctor')
    City = models.CharField(max_length=200)
    Subdivision = models.CharField(max_length=100)
    District = models.ForeignKey(Districts, on_delete=models.CASCADE, related_name='current_district_doctors')
    Pin = models.CharField(max_length=6, validators=[only_numeric])
    Image = models.ImageField(upload_to=user_image_directory_path, validators=[validate_image_type, validate_file_size,])
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )
    Pending_Upgradation = models.BooleanField(default=False)

    objects = models.Manager() # our default django manager
    upgrade_Not_Pending_objects = NonPending_Doctors()
    upgrade_Pending_objects = Pending_Doctors()

    class Meta:
        ordering = ['Name',]
        verbose_name = 'Doctor'
        verbose_name_plural = 'Doctors'
        indexes = [
            models.Index(fields=['Username', 'Name'], include=['Degree', 'Special', 'Gender', 'Address', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Image'], name='doctor_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(Doctor, self).save(*args, **kwargs)

    def __str__(self):
        return self.Name

class DoctorRatingRecord(models.Model):
    Doctor_ID = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctor_ratings', related_query_name='doctor_rating')
    Rate = models.IntegerField(default=0)
    Person = models.ForeignKey(Users, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=True, )
    
    class Meta:
        get_latest_by = ['-timestamp']
        ordering = ['Doctor_ID',]
        verbose_name = 'Doctor Rating Record'
        verbose_name_plural = 'Doctor Rating Records'
        indexes = [
            models.Index(fields=['Doctor_ID', 'Rate', 'Person'], name='doctor_rating_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(DoctorRatingRecord, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.Doctor_ID)


class Blood_Donar(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, unique=True, related_name='user_blooddonors')
    Name = models.CharField(max_length=100, validators=[name_validation, prefix_validation])
    Gender = models.CharField(max_length=30, choices=gender_ch)
    Blood_Group = models.CharField(max_length=50, choices=blood_groups)
    Date_of_Birth = models.DateField(validators=[dob_validation])
    Permanent_Address = models.TextField(max_length=500)
    Permanent_State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='permanent_state_blood_donors', related_query_name='permanent_state_blood_donor')
    Permanent_City = models.CharField(max_length=200)
    Permanent_Subdivision = models.CharField(max_length=100)
    Permanent_District = models.ForeignKey(Districts, on_delete=models.CASCADE, related_name='permanent_district_blood_donors')
    Permanent_Pin = models.CharField(max_length=6, validators=[only_numeric])
    Address = models.TextField(max_length=500)
    State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='current_state_blooddonors', related_query_name='current_state_blooddonor')
    City = models.CharField(max_length=200)
    Subdivision = models.CharField(max_length=100)
    District = models.ForeignKey(Districts, on_delete=models.CASCADE, related_name='current_district_blooddonors')
    Pin = models.CharField(max_length=6, validators=[only_numeric])
    Image = models.ImageField(upload_to=user_image_directory_path, validators=[validate_image_type, validate_file_size,])
    Created_at = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )

    class Meta:
        ordering = ['Name',]
        verbose_name = 'Blood Donor'
        verbose_name_plural = 'Blood Donors'
        indexes = [
            models.Index(fields=['Username', 'Name'], include=['Gender', 'Blood_Group', 'Address', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Image'], name='blood_donor_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(Blood_Donar, self).save(*args, **kwargs)

    def __str__(self):
        return self.Name


class past_and_present_BloodDonationCamp(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(Q(Start_Date__lte=zonetime.now().date()))
class past_BloodDonationCamp(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(Q(End_Date=None, Start_Date__lte=zonetime.now().date()) | Q(~Q(End_Date=None), End_Date__lte=zonetime.now().date())).exclude(Q(End_Date=None, Start_Date=zonetime.now().date(), End_Time__gte=zonetime.now().time()) | Q(~Q(End_Date=None), End_Date=zonetime.now().date(), End_Time__gte=zonetime.now().time()))
class current_and_future_BloodDonationCamp(models.Manager):
    def get_queryset(self):
        some_hour_before = zonetime.now() - datetime.timedelta(hours=1.5)
        return super().get_queryset().filter(Q(End_Date=None, Start_Date__gte=some_hour_before.date()) | Q(~Q(End_Date=None), End_Date__gte=some_hour_before.date())).exclude(Q(End_Date=None, Start_Date=some_hour_before.date(), End_Time__lt=some_hour_before.time()) | Q(~Q(End_Date=None), End_Date=some_hour_before.date(), End_Time__lt=some_hour_before.time()))
class incoming_BloodDonationCamp(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(Q(End_Date=None, Start_Date__gte=zonetime.now().date()) | Q(~Q(End_Date=None), End_Date__gte=zonetime.now().date())).exclude(Q(End_Date=None, Start_Date=zonetime.now().date(), End_Time__lte=zonetime.now().time()) | Q(~Q(End_Date=None), End_Date=zonetime.now().date(), End_Time__lte=zonetime.now().time()))
class today_BloodDonationCamp(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(Q(End_Date=None, Start_Date=datetime.datetime.now()) | Q(~Q(End_Date=None), Start_Date__lte=datetime.datetime.now(), End_Date__gte=datetime.datetime.now()))
class BloodDonationCamp(models.Model):
    camp_id = models.CharField(max_length=30, unique=True, default='0')
    Organizer = models.CharField(max_length=500, validators=[office_name_validation])
    Organizer_Contact = models.CharField(max_length=10, validators=[contact_validation])
    Email = models.EmailField(max_length=100)
    Organizer_Website = models.URLField(max_length=500, null=True, blank=True)
    State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='state_blooddonationcamps', related_query_name='state_blooddonationcamp')
    City = models.CharField(max_length=200)
    Subdivision = models.CharField(max_length=200)
    District = models.ForeignKey(Districts, on_delete=models.CASCADE)
    Pin = models.CharField(max_length=6, validators=[only_numeric])
    Landmark = models.CharField(max_length=500)
    Start_Date = models.DateField()
    End_Date = models.DateField(null=True, blank=True)
    Start_Time = models.TimeField()
    End_Time = models.TimeField()

    objects = models.Manager() # our default django manager
    past_and_present_objects = past_and_present_BloodDonationCamp()
    past_objects = past_BloodDonationCamp()
    current_and_future_objects = current_and_future_BloodDonationCamp() # creating our custom manager object
    incoming_objects = incoming_BloodDonationCamp() # creating our custom manager object
    today_objects = today_BloodDonationCamp() # creating our custom manager object

    class Meta:
        get_latest_by = ['-Start_Date', '-Start_Time']
        ordering = ['-Start_Date',]
        verbose_name = 'Blood Donation Camp'
        verbose_name_plural = 'Blood Donation Camps'
        indexes = [
            models.Index(fields=['State', 'City', 'Subdivision', 'District', 'Pin'], include=['Organizer', 'Organizer_Contact'], name='donation_camp_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(BloodDonationCamp, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('Go_Healthy_App:BloodDonationCampDetail', kwargs={'id': self.camp_id})

    def __str__(self):
        return self.Organizer


class CampReminder(models.Model):
    Username = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True, related_name="user_reminders", related_query_name="user_reminder")
    Camp = models.ForeignKey(BloodDonationCamp, on_delete=models.CASCADE, related_name="camp_reminders", related_query_name="camp_reminder")
    Mobile = models.CharField(max_length=10, validators=[contact_validation])
    Send_Before_in_minute = models.BigIntegerField(default=30)
    reminder_sent = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(CampReminder, self).save(*args, **kwargs)
    

class BloodDonationCollectionRecord(models.Model):
    Certificate_Id = models.CharField(max_length=20, unique=True, default='0', db_index=True)
    Username = models.ManyToManyField(Users, blank=True, related_name="user_bloodcertificates", related_query_name="user_bloodcertificate")
    Email = models.EmailField(max_length=200, null=True, blank=True)
    Name = models.CharField(max_length=200)
    Phone = models.CharField(max_length=10, validators=[contact_validation])
    Blood_Group = models.CharField(max_length=50)
    Unit = models.IntegerField()
    Gender = models.CharField(max_length=100, choices=gender_ch)
    Age = models.IntegerField()
    Component = models.CharField(max_length=100, choices=blood_main_components)
    Blood_Bank = models.ForeignKey(BloodBank, on_delete=models.CASCADE)
    Certificate_issued_for = models.CharField(max_length=50, choices=Certificate_issued_for_ch)
    Certificate = models.FileField(upload_to=certificate_directory_path, validators=[validate_document_file_type])
    Issued_at = models.DateTimeField(auto_now_add=True, )
    
    class Meta:
        ordering = ['-Issued_at',]
        verbose_name = 'Blood Certificate'
        verbose_name_plural = 'Blood Certificate'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(BloodDonationCollectionRecord, self).save(*args, **kwargs)

    def __str__(self):
        return self.Certificate_Id


class Past_few_days_BloodRequest(models.Manager):
    '''first we get all objects from the database by
    calling the get_queryset method of the inherited class
    i.e. Manager class using super().get_queryset().
    After that we are filtering objects having city attribute equal to kolkata
    and return the filtered objects'''
    def get_queryset(self):
        last_hour = zonetime.now() - datetime.timedelta(hours=48)
        return super().get_queryset().filter(Requested_at__gte=last_hour)
class today_BloodRequest(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(Requested_at__date=zonetime.now().date())
class BloodRequest(models.Model):
    Patient_Name = models.CharField(max_length=200)
    Blood_Group = models.CharField(max_length=50, choices=blood_groups)
    Unit = models.PositiveIntegerField(default=1)
    Contact = models.CharField(max_length=10, validators=[contact_validation])
    Admit_Hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    Requested_at = models.DateTimeField(auto_now_add=True, )
    Username = models.ForeignKey(Users, on_delete=models.CASCADE)

    objects = models.Manager() # our default django manager
    past_few_days_objects = Past_few_days_BloodRequest() # creating our custom manager object
    today_objects = today_BloodRequest() # creating our custom manager object

    class Meta:
        get_latest_by = ['-Requested_at']
        ordering = ['-Requested_at',]
        verbose_name = 'Blood Request'
        verbose_name_plural = 'Blood Requests'
        indexes = [
            models.Index(fields=['Blood_Group', 'Admit_Hospital', 'Username'], include=['Patient_Name', 'Contact'], name='blood_request_index'),
        ]

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(BloodRequest, self).save(*args, **kwargs)


class CourseOfferer(models.Model):
    Name = models.CharField(max_length=300)
    Logo = models.ImageField(upload_to='images/Course Offerer Logo', validators=[validate_image_type, validate_file_size])
    URL = models.URLField(max_length=1000)

    class Meta:
        verbose_name = 'Course Offerer'
        verbose_name_plural = 'Course Offereres'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(CourseOfferer, self).save(*args, **kwargs)

class CourseInstructor(models.Model):
    username = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='user_course_instructors', related_query_name='user_course_instructors')
    Name = models.CharField(max_length=300)
    Image = models.ImageField(upload_to=user_image_directory_path, validators=[validate_image_type, validate_file_size])
    Bio = models.TextField(max_length=50000)
    Profession = models.CharField(max_length=200, blank=True, null=True)
    Works_at = models.CharField(max_length=1000, blank=True, null=True)
    facebook_username = models.CharField(max_length=100, blank=True, null=True)
    twitter_username = models.CharField(max_length=100, blank=True, null=True)
    linkedin_username = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = 'Course Instructor'
        verbose_name_plural = 'Courses Instructors'

    def get_absolute_url(self):
        return reverse('Go_Healthy_App:FirstAidInstructor', kwargs={'username': self.username.username,})

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(CourseInstructor, self).save(*args, **kwargs)

class FirstaidPhotoCourse(models.Model):
    Course_Id = models.CharField(max_length=7, unique=True, primary_key=True)
    Name = models.CharField(max_length=300)
    Description = models.TextField(max_length=10000)
    Language = models.ForeignKey(Languages, on_delete=models.CASCADE)
    What_Learn = models.TextField(max_length=99999)
    Level = models.CharField(choices=course_level_ch, max_length=100)
    Photo = models.ImageField(upload_to='images/Course/First Aid/Course_Banners', validators=[validate_image_type, validate_file_size])
    slug = models.SlugField(max_length=400, blank=True, null=True)
    Created = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )
    Hide_Course = models.BooleanField(default=False)

    class Meta:
        ordering = ['Name', 'Language']
        verbose_name = 'Course of First Aid Photo'
        verbose_name_plural = 'Courses of First Aid Photo'

    def save(self, *args, **kwargs):
        self.slug = slugify(self.Name)
        self.full_clean() # calls self.clean() as well cleans other fields
        super(FirstaidPhotoCourse, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('Go_Healthy_App:firstaid-Photo-course', kwargs={'id': self.Course_Id, 'slug': self.slug})
    
    def __str__(self):
        return self.Course_Id


class FirstaidPhoto(models.Model):
    SL_No = models.IntegerField()
    Course = models.ForeignKey(FirstaidPhotoCourse, on_delete=models.CASCADE, related_name='course_firstaid_photos', related_query_name='course_firstaid_photo')
    Name = models.CharField(max_length=200)
    Upload_Photo = models.ImageField(upload_to='images/Course/First Aid/Course_Contents', validators=[validate_image_type, validate_large_file_size])
    Description = models.TextField(blank=True, null=True, max_length=10000)
    Hide_Photo = models.BooleanField(default=False)

    class Meta:
        unique_together = ['Course', 'SL_No']
        ordering = ['Course', 'SL_No', 'Name']
        verbose_name = 'First Aid Photo'
        verbose_name_plural = 'First Aid Photos'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(FirstaidPhoto, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.SL_No) + '. ' + self.Name


class FirstaidVideoCourse(models.Model):
    Course_Id = models.CharField(max_length=7, unique=True, primary_key=True)
    Name = models.CharField(max_length=300)
    Description = models.TextField(max_length=10000)
    Offered_By = models.ForeignKey(CourseOfferer, on_delete=models.CASCADE, related_name='offered_by_firstaid_video_courses', related_query_name='offered_by_firstaid_video_course', blank=True, null=True)
    Instructor = models.ForeignKey(CourseInstructor, on_delete=models.CASCADE, related_name='instructor_firstaid_video_courses', related_query_name='instructor_firstaid_video_course', blank=True, null=True)
    Language = models.ForeignKey(Languages, on_delete=models.CASCADE)
    What_Learn = models.TextField(max_length=99999)
    Level = models.CharField(choices=course_level_ch, max_length=100)
    Photo = models.ImageField(upload_to='images/Course/First Aid/Course_Banners', validators=[validate_image_type, validate_file_size])
    slug = models.SlugField(max_length=400, blank=True, null=True)
    Created = models.DateTimeField(auto_now_add=True, )
    Last_Update = models.DateTimeField(auto_now=True, )
    Hide_Course = models.BooleanField(default=False)

    class Meta:
        ordering = ['Name', 'Language']
        verbose_name = 'Course of First Aid Video'
        verbose_name_plural = 'Courses of First Aid Video'
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.Name)
        self.full_clean() # calls self.clean() as well cleans other fields
        super(FirstaidVideoCourse, self).save(*args, **kwargs)
    def get_absolute_url(self):
        return reverse('Go_Healthy_App:firstaid-video-course', kwargs={'id': self.Course_Id, 'slug': self.slug})
    
    
    def __str__(self):
        return self.Course_Id


class FirstaidVideoSection(models.Model):
    SL_No = models.IntegerField()
    Name = models.CharField(max_length=1000)
    Course = models.ForeignKey(FirstaidVideoCourse, on_delete=models.CASCADE, related_name='course_firstaid_video_sections', related_query_name='course_firstaid_video_section')

    class Meta:
        unique_together = ['Course', 'SL_No']
        ordering = ['SL_No', 'Name']
        verbose_name = 'Section for First Aid Video'
        verbose_name_plural = 'Sections for First Aid Video'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(FirstaidVideoSection, self).save(*args, **kwargs)


class FirstaidVideo(models.Model):
    SL_No = models.IntegerField()
    Course = models.ForeignKey(FirstaidVideoCourse, on_delete=models.CASCADE, related_name='course_firstaid_videos', related_query_name='course_firstaid_video')
    Section = models.ForeignKey(FirstaidVideoSection, on_delete=models.CASCADE, related_name='section_firstaid_videos', related_query_name='section_firstaid_video')
    Name = models.CharField(max_length=200)
    Video = models.FileField(max_length=500, upload_to='videos/Course/First Aid/Course_Contents', validators=[validate_video_type])
    Hide_Video = models.BooleanField(default=False)

    class Meta:
        unique_together = [['Course', 'SL_No']]
        ordering = ['Course', 'Section', 'SL_No', 'Name']
        verbose_name = 'First Aid Video'
        verbose_name_plural = 'First Aid Videos'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(FirstaidVideo, self).save(*args, **kwargs)
    
    def __str__(self):
        return str(self.SL_No) + '. ' + self.Name


class FirstAidVideoSubtitle(models.Model):
    video = models.ForeignKey(FirstaidVideo, on_delete=models.CASCADE, related_name='video_firstaid_video_subtitles', related_query_name='video_firstaid_video_subtitle')
    Subtitle_Language = models.ForeignKey(Languages, on_delete=models.CASCADE)
    Subtitle_File = models.FileField(max_length=500, upload_to='subtitles/Course/First Aid/Video_Subtitles', validators=[validate_subtitle_file])

    class Meta:
        unique_together = [['video', 'Subtitle_Language']]
        verbose_name = 'First Aid Video Subtitle'
        verbose_name_plural = 'First Aid Videos Subtitles'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(FirstAidVideoSubtitle, self).save(*args, **kwargs)

class FirstAidCourseEnrollment(models.Model):
    Username = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="user_first_aid_course_enrollments", related_query_name="user_first_aid_course_enrollment")
    First_Aid_Video = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="video_first_aid_course_enrollments", related_query_name="video_first_aid_course_enrollment")
    First_Aid_Photo = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="photo_first_aid_course_enrollments", related_query_name="photo_first_aid_course_enrollment")
    Progress = models.FloatField(default=0.0)
    Enrolled_Date = models.DateTimeField(auto_now_add=True, )

    class Meta:
        verbose_name = 'First Aid Course Enrollment'
        verbose_name_plural = 'First Aid Course Enrollments'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(FirstAidCourseEnrollment, self).save(*args, **kwargs)



class ComplaintReplyAttachment(models.Model):
    Reply_Attachment = models.FileField(upload_to='documents/Attachments/Complaints/Replies', validators=[validate_large_file_size, validate_file_type])
    timestamp = models.DateTimeField(auto_now_add=True,)
    class Meta:
        ordering = ['timestamp']
        verbose_name = 'Complaint Reply Attachment'
        verbose_name_plural = 'Complaint Reply Attachments'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(ComplaintReplyAttachment, self).save(*args, **kwargs)
 
class ComplaintReplyReplies(models.Model):
    Text = models.TextField(max_length=10000)
    Attachments = models.ManyToManyField(ComplaintReplyAttachment, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True,)
    class Meta:
        ordering = ['timestamp']
        verbose_name = 'Complaint Reply'
        verbose_name_plural = 'Complaint Replies'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(ComplaintReplyReplies, self).save(*args, **kwargs)

class Complaint(models.Model):
    Complain_Id = models.CharField(max_length=7, primary_key=True, unique=True, db_index=True)
    Name = models.CharField(max_length=100)
    Email = models.EmailField(max_length=100)
    Phone = models.CharField(max_length=10, validators=[contact_validation])
    State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='state_complaints', related_query_name='state_complaint')
    Address = models.TextField(max_length=500)
    District = models.ForeignKey(Districts, on_delete=models.CASCADE)
    Subdivision = models.CharField(max_length=100)
    City = models.CharField(max_length=100)
    Pin = models.CharField(max_length=6, validators=[only_numeric])
    Language = models.ForeignKey(Languages, on_delete=models.CASCADE)
    Attachment = models.FileField(null=True, blank=True, upload_to='documents/Attachments/Complaints', validators=[validate_file_type, validate_large_file_size], help_text='If you have any document or proof regarding your complaint, then please attach it.')
    Subject = models.CharField(max_length=200)
    Complain = models.TextField(max_length=10000)
    Status = models.CharField(max_length=50, choices=complaint_status_ch, default='Pending')
    Complaint_Time = models.DateTimeField(auto_now_add=True,)
    Last_Update = models.DateTimeField(auto_now=True,)
    Replies = models.ManyToManyField(ComplaintReplyReplies, blank=True)
    class Meta:
        get_latest_by = ['-Complaint_Time']
        ordering = ['-Complaint_Time']
        verbose_name = 'Complaint'
        verbose_name_plural = 'Complaints'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(Complaint, self).save(*args, **kwargs)



class UserFeedback(models.Model):
    Email = models.EmailField(max_length=100)
    Feedback = models.TextField(max_length=1000)
    Added_at = models.DateTimeField(auto_now_add=True, )
    class Meta:
        get_latest_by = ['-Added_at']
        ordering = ['-Added_at']
        verbose_name = 'User Feedback'
        verbose_name_plural = 'User Feedbacks'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(UserFeedback, self).save(*args, **kwargs)


class ContactUs(models.Model):  # For ContactUs Form
    Name = models.CharField(max_length=50)
    Phone = models.CharField(max_length=10, validators=[contact_validation])
    Email = models.EmailField(max_length=100)
    Message = models.TextField(max_length=1000)
    Contact_Time = models.DateTimeField(auto_now_add=True, )
    class Meta:
        get_latest_by = ['-Contact_Time']
        ordering = ['-Contact_Time']
        verbose_name_plural = 'Contact Us'
    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(ContactUs, self).save(*args, **kwargs)


class AdminEmails(models.Model):
    Email = models.EmailField(max_length=100)
    Purpose = ArrayField(base_field=models.CharField(max_length=300))

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(AdminEmails, self).save(*args, **kwargs)



class Emergency_Number(models.Model):
    Office = models.CharField(max_length=200, validators=[office_name_validation])
    Title = models.CharField(max_length=10, choices=title, blank=True, null=True)
    Person = models.CharField(max_length=200, blank=True, null=True, validators=[name_validation, prefix_validation])
    Person_Designation = models.CharField(max_length=200, blank=True, null=True)
    State = models.ForeignKey(States, on_delete=models.CASCADE, related_name='state_emergencies', related_query_name='state_emergency')
    District = models.ForeignKey(Districts, on_delete=models.CASCADE)
    Subdivision = models.CharField(max_length=200)
    Contact = ArrayField(base_field=models.CharField(max_length=15, validators=[contact_validation]))

    class Meta:
        ordering = ['State', 'District', 'Subdivision', 'Office']
        verbose_name = 'Emergency Number'
        verbose_name_plural = 'Emergency Numbers'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(Emergency_Number, self).save(*args, **kwargs)


class Chat(models.Model):
    From = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='from_chats')
    To = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='to_chats')
    Message = models.TextField(blank=True, null=True, max_length=10000, default='na')
    Delivered = models.BooleanField(default=False, auto_created=False)
    Time = models.DateTimeField(auto_now_add=True, )
    Deleted = models.BooleanField(default=False)
    class Meta:
        ordering = ['Time',]
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'

class OTP(models.Model):
    MobileOTP = models.CharField(max_length=6, blank=True, null=True)
    EmailOTP = models.CharField(max_length=6, blank=True, null=True)
    Mobile = models.CharField(max_length=10, null=True, blank=True)
    Email = models.EmailField(max_length=100, null=True, blank=True)
    Send_For = models.CharField(max_length=100, choices=OTP_Send_For_ch)
    Is_Verified = models.BooleanField(default=False)
    expire = models.CharField(default='limited_time', max_length=30)
    Added_at = models.DateTimeField(auto_now_add=True,)
    class Meta:
        unique_together = [['Mobile', 'Send_For'], ['Email', 'Send_For'], ['Mobile', 'MobileOTP'], ['Email', 'EmailOTP']]
        verbose_name = 'OTP'
        verbose_name_plural = 'OTPs'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(OTP, self).save(*args, **kwargs)


class ResetPasswordCode(models.Model):
    Username = models.OneToOneField(Users, on_delete=models.CASCADE, unique=True)
    Code = models.CharField(max_length=100, unique=True, db_index=True)
    Added_at = models.DateTimeField(auto_now_add=True,)
    class Meta:
        verbose_name = 'Reset Password Code'
        verbose_name_plural = 'Reset Password Codes'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(ResetPasswordCode, self).save(*args, **kwargs)

class TotalVisitor(models.Model):
    Total = models.IntegerField(default=0)
    class Meta:
        verbose_name = 'Total Visitor'
        verbose_name_plural = 'Total Visitor'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(TotalVisitor, self).save(*args, **kwargs)


class PeopleVoice(models.Model):
    Language = models.ForeignKey(Languages, on_delete=models.CASCADE)
    Text = models.CharField(max_length=5000)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, blank=True, null=True)
    Is_Approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        get_latest_by = ['-created_at']
        ordering = ['-created_at',]
        verbose_name = 'People Voice'
        verbose_name_plural = 'People Voices'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(PeopleVoice, self).save(*args, **kwargs)


class SiteContact(models.Model):
    Contact_Number = models.CharField(max_length=15, unique=True, validators=[contact_validation])
    Contact_For = models.CharField(max_length=100)
    is_24x7 = models.BooleanField(default=False,)
    is_main = models.BooleanField(default=False)
    added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['is_main', 'added',]
        verbose_name = 'Site Contact'
        verbose_name_plural = 'Site Contacts'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(SiteContact, self).save(*args, **kwargs)

class SiteEmail(models.Model):
    EmailId = models.EmailField(max_length=200, unique=True)
    Mail_For = models.CharField(max_length=100)
    is_main = models.BooleanField(default=False)
    added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['is_main', 'added',]
        verbose_name = 'Site Email'
        verbose_name_plural = 'Site Emails'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(SiteEmail, self).save(*args, **kwargs)

class WhatsappNumber(models.Model):
    Whatsapp_Number = models.CharField(max_length=15, validators=[contact_validation])
    Contact_For = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'WhatsApp Number'
        verbose_name_plural = 'WhatsApp Numbers'

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(WhatsappNumber, self).save(*args, **kwargs)


class WorkingHour(models.Model):
    Monday = models.CharField(max_length=100)
    Tuesday = models.CharField(max_length=100)
    Wednesday = models.CharField(max_length=100)
    Thursday = models.CharField(max_length=100)
    Friday = models.CharField(max_length=100)
    Saturday = models.CharField(max_length=100)
    Sunday = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        self.full_clean() # calls self.clean() as well cleans other fields
        return super(WorkingHour, self).save(*args, **kwargs)


@receiver(post_delete, sender=HospitalDepartment)
def hospitalDepartment_delete(sender, instance, **kwargs):
    med = HospitalDepartment.objects.get_or_create(department="General Medicine")[0].id
    SomeCommonDisease.objects.filter(Concerned_Department=instance).update(Concerned_Department=med)

    


@receiver(post_save, sender=BedNo)
@receiver(post_delete, sender=BedNo)
def BedNo_change(sender, instance, **kwargs):
    from .utils import fetchBed
    hospital = Hospital.objects.filter(id=instance.Hospital.id)
    fetchBed(hospital)

@receiver(post_save, sender=BedNo)
def bed_save(sender, instance, **kwargs):
    if instance.Availability == 'Available':
        PatientData.objects.filter(Bed_No=instance).update(Bed_No=None)


@receiver(post_save, sender=PatientData)
@receiver(post_delete, sender=PatientData)
def PatientData_change(sender, instance, **kwargs):
    try:
        total = PatientData.objects.filter(Username=instance.Username).exclude(Status='Expired').exclude(Booked_By='Hospital Authority').count()
        eventData = {
            'total_book': total,
            'book_changed': '1',
            'chat_changed': '0',
        }
        send_event('notification-{}'.format(instance.Username.username), 'message', eventData)
        totalBook = PatientData.objects.filter(Booking_Time__date=datetime.datetime.now()).exclude(Status='Expired').exclude(Booked_By='Hospital Authority').count()
        totalAdmit = PatientData.objects.filter(Admit_Time__date=datetime.datetime.now(), Status='Admitted').count()
        totalReleased = PatientData.objects.filter(Status_Changed_At__date=datetime.datetime.now(), Status='Released').count()
        totalDied = PatientData.objects.filter(Status_Changed_At__date=datetime.datetime.now(), Status='Died').count()
        eventData = {
            'total_book': totalBook,
            'book_changed': '1',
            'total_admit': totalAdmit,
            'admit_changed': '1',
            'total_released': totalReleased,
            'released_changed': '1',
            'total_died': totalDied,
            'died_changed': '1',
        }
        send_event('liveData', 'message', eventData)
        if instance.Disease is not None and instance.Disease != '':
            diseaseData = {
                'new_disease': instance.Disease.Disease
            }
            send_event('newDisease', 'message', diseaseData)
        if any(item in instance.Username.User_Type for item in special_user_types): # check if User_Type array consists any item of specialUser list
            eventData = {
                'message':'1',
            }
        else:
            userBook = PatientData.objects.filter(Username=instance.Username, Status='Not Admit Still Now')
            if userBook.exists():
                nextTime = userBook.first().Expire_Time
                eventData = {
                    'message':'0',
                    'nextTime': nextTime
                }
            else:
                eventData = {
                    'message':'1',
                }
        send_event('nowBook-{}'.format(instance.Username.username), 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")


@receiver(post_delete, sender=PatientData)
def PatientData_delete(sender, instance, **kwargs):
    BedNo.objects.filter(Q(Booking_Id=instance.Booking_ID) & ~Q(Availability="Null")).update(Availability='Available', Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
    BedNo_change(sender, instance.Bed_No, **kwargs)

@receiver(post_save, sender=PatientData)
def PatientData_save(sender, instance, **kwargs):
    if instance.Status not in ["Admitted"]:
        BedNo.objects.filter(Q(Booking_Id=instance.Booking_ID) & ~Q(Availability="Null")).update(Availability='Available', Book_by=None, Booking_Id=None, Last_Update=zonetime.now())


@receiver(post_save, sender=ReferredPatient)
@receiver(post_delete, sender=ReferredPatient)
def ReferredPatient_change(sender, instance, **kwargs):
    try:
        eventData = {
            'total_referred': ReferredPatient.objects.filter(ReferredDate__date=zonetime.now()).order_by('Patient__pk').distinct('Patient__pk').count(),
            'referred_changed': '1',
        }
        send_event('liveData', 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")


@receiver(pre_delete, sender=Disease)
def Disease_delete(sender, instance, **kwargs):
    disease_other = Disease.objects.get_or_create(Disease="Other")[0]
    PatientData.objects.filter(Disease=instance).update(Disease=disease_other)


@receiver(post_save, sender=Users)
@receiver(post_delete, sender=Users)
def userUpdate(sender, instance, **kwargs):
    try:
        totalHos = Hospital.objects.filter(Username__is_verified=True, Username__is_active=True, Username__Registered=True, Username__User_Type__contains=['Hospital']).count()
        totalBank = BloodBank.objects.filter(Username__is_verified=True, Username__is_active=True, Username__Registered=True, Username__User_Type__contains=['Blood Bank']).count()
        totalDoc = Doctor.upgrade_Not_Pending_objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Doctor']).count()
        totalDonor = Blood_Donar.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Blood Donor']).count()
        eventData = {
            'total_hospital': totalHos,
            'hospital_changed': '1',
            'total_bloodBank': totalBank,
            'bloodBank_changed': '1',
            'total_donor': totalDonor,
            'donor_changed': '1',
            'total_doctor': totalDoc,
            'doctor_changed': '1',
        }
        send_event('liveData', 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    

@receiver(post_save, sender=BloodBank)
@receiver(post_delete, sender=BloodBank)
def bloodBank_change(sender, instance, **kwargs):
    try:
        Blood_Availability = instance.Blood_Availability
        eventData = {
            'blood_bank_id': instance.Unique_Id,
            'Blood_Availability': Blood_Availability,
            'Last_Update': instance.Last_Update,
        }
        send_event('liveBloodStatus', 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")


@receiver(post_save, sender=BloodRequest)
@receiver(post_delete, sender=BloodRequest)
def BloodRequest_change(sender, instance, **kwargs):
    try:
        totalBloodRequest = BloodRequest.objects.filter(Requested_at__date=datetime.datetime.now()).count()
        eventData = {
            'total_bloodRequest': totalBloodRequest,
            'bloodRequest_changed': '1',
        }
        send_event('liveData', 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")


@receiver(post_save, sender=BloodDonationCamp)
@receiver(post_delete, sender=BloodDonationCamp)
def BloodDonationCamp_change(sender, instance, **kwargs):
    try:
        eventData = {
            'total_bloodDonationCamp': BloodDonationCamp.objects.filter(Q(Start_Date=datetime.datetime.now(), End_Date=None) | Q(Start_Date__lte=datetime.datetime.now(), End_Date__gte=datetime.datetime.now())).count(),
            'bloodDonationCamp_changed': '1',
        }
        send_event('liveData', 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    

@receiver(post_save, sender=BloodDonationCollectionRecord)
@receiver(post_delete, sender=BloodDonationCollectionRecord)
def BloodDonationCollectionRecord_change(sender, instance, **kwargs):
    try:
        eventData = {
            'total_bloodDonated': BloodDonationCollectionRecord.objects.filter(Issued_at__date=datetime.datetime.now(), Certificate_issued_for="Blood Donation").count(),
            'bloodDonated_changed': '1',
            'total_bloodCollected': BloodDonationCollectionRecord.objects.filter(Issued_at__date=datetime.datetime.now(), Certificate_issued_for="Blood Collection").count(),
            'bloodCollected_changed': '1',
        }
        send_event('liveData', 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")

    

@receiver(post_save, sender=TotalVisitor)
def visitorAdd(sender, instance, **kwargs):
    try:
        totalVisitors = TotalVisitor.objects.all().first()
        totalVisitors = totalVisitors.Total
        eventData = {
            'total_visitor': totalVisitors,
        }
        send_event('liveSiteVisitor', 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")


@receiver(pre_save, sender=Hospital)
def hospitalSetId(sender, instance, **kwargs):
    if instance.pk is None: #if save first time
        e = string.digits
        hospitalId = ''
        while(1):
            hospitalId = ''.join([secrets.choice(e) for i in range(7)])
            if Hospital.objects.filter(Unique_Id=hospitalId).exists():
                continue
            else:
                break
        instance.Unique_Id = hospitalId
        authToken = ''
        alphaNumeric = string.ascii_uppercase + string.digits
        while(1):
            authToken = ''.join([secrets.choice(alphaNumeric) for i in range(40)])
            if Hospital.objects.filter(Auth_Key=authToken).exists():
                continue
            else:
                break
        instance.Auth_Key = authToken
        

@receiver(pre_save, sender=BloodDonationCamp)
def bloodDonationCampSetId(sender, instance, **kwargs):
    if instance.pk is None: #if save first time
        alphaNumeric = string.ascii_letters + string.digits
        bloodDonationCampId = ''
        while(1):
            bloodDonationCampId = ''.join([secrets.choice(alphaNumeric) for i in range(30)])
            if BloodDonationCamp.objects.filter(camp_id=bloodDonationCampId).exists():
                continue
            else:
                break
        instance.camp_id = bloodDonationCampId

@receiver(pre_save, sender=BloodBank)
def bloodBankSetId(sender, instance, **kwargs):
    if instance.pk is None: #if save first time
        e = string.digits
        bloodBankId = ''
        while(1):
            bloodBankId = ''.join([secrets.choice(e) for i in range(7)])
            if BloodBank.objects.filter(Unique_Id=bloodBankId).exists():
                continue
            else:
                break
        instance.Unique_Id = bloodBankId

        
@receiver(pre_save, sender=BloodDonationCollectionRecord)
def bloodCertificateSave(sender, instance, **kwargs):
    if instance.pk is None: #if save first time
        certificateId = ''
        alphaNumeric = string.ascii_uppercase + string.digits
        while(1):
            certificateId = ''.join([secrets.choice(alphaNumeric) for i in range(20)])
            if BloodDonationCollectionRecord.objects.filter(Certificate_Id=certificateId).exists():
                continue
            else:
                break
        instance.Certificate_Id = certificateId
    

@receiver(post_save, sender=Chat)
def chat_Change(sender, instance, **kwargs):
    try:
        chats = Chat.objects.filter(To=instance.To, Deleted=False, Delivered=False)
        eventData = {
            'total_chat': chats.count(),
            'book_changed': '0',
            'chat_changed': '1',
        }
        send_event('notification-{}'.format(instance.To.username), 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
        

@receiver(pre_save, sender=FirstaidPhotoCourse)
def firstAidPhotoCourseSetId(sender, instance, **kwargs):
    if instance.pk is None: #if save first time
        alphaNumeric = string.ascii_letters + string.digits
        while(1):
            courseId = ''.join([secrets.choice(alphaNumeric) for i in range(7)])
            if FirstaidPhotoCourse.objects.filter(Course_Id=courseId).exists():
                continue
            else:
                break
        instance.Course_Id = courseId

@receiver(pre_save, sender=FirstaidVideoCourse)
def firstAidVideoCourseSetId(sender, instance, **kwargs):
    if instance.pk is None: #if save first time
        alphaNumeric = string.ascii_letters + string.digits
        while(1):
            courseId = ''.join([secrets.choice(alphaNumeric) for i in range(7)])
            if FirstaidVideoCourse.objects.filter(Course_Id=courseId).exists():
                continue
            else:
                break
        instance.Course_Id = courseId   
 
@receiver(post_save, sender=FirstaidPhoto)
def first_aid_photo_saved(sender, instance, **kwargs):
    instance.Course.Last_Update = zonetime.now()
    instance.Course.save()
    
@receiver(post_save, sender=FirstaidVideo)
def first_aid_video_saved(sender, instance, **kwargs):
    instance.Course.Last_Update = zonetime.now()
    instance.Course.save()
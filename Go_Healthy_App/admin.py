from django.contrib import admin
from django.forms import ModelForm
from embed_video.admin import AdminVideoMixin
from django.contrib.admin.models import *
from django.contrib.sessions.models import Session
from django_admin_hstore_widget.forms import HStoreFormField
from .models import *
from .forms import *

# Register your models here.
class UsersAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'Contact', 'User_Type', 'ID_Type', 'ID_Number', 'is_verified', 'is_book_allow', 'is_active', 'Registered', 'last_login', 'date_joined', 'is_superuser', 'is_staff']
    list_filter = ['User_Type', 'ID_Type', 'is_verified', 'is_book_allow', 'is_active', 'is_superuser', 'is_staff']
    search_fields = ['username', 'email', 'Contact', 'ID_Number',]
    exclude = ['password', 'last_login', 'date_joined', 'last_seen', 'is_online', 'username', 'first_name', 'last_name']
admin.site.register(Users, UsersAdmin)


class SiteAdminUserAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Name', 'Created_at', 'Last_Update']
    search_fields = ['Username', 'Name']
    fields = ['Username', 'Name']
admin.site.register(SiteAdmin, SiteAdminUserAdmin)


class NormalUserAdminForm(ModelForm):
    class Meta:
        model = NormalUser
        fields = []
class NormalUserAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Name', 'Gender', 'Permanent_State', 'Permanent_City', 'Permanent_Subdivision', 'Permanent_District', 'Permanent_Pin', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Image', 'Created_at', 'Last_Update']
    list_filter = ['Gender', 'Permanent_State', 'Permanent_District', 'State', 'District']
    search_fields = ['Username', 'Name', 'Permanent_City', 'Permanent_Subdivision', 'Permanent_Pin', 'City', 'Subdivision', 'Pin']
    #form = NormalUserAdminForm
admin.site.register(NormalUser, NormalUserAdmin)



class HospitalAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Unique_Id', 'Auth_Key', 'Name', 'Type', 'Emergency_Number', 'Toll_Free_Number', 'Helpline_Number', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Has_Antivenom', 'Oxygen_Remaining_Time', 'Latitude', 'Longitude', 'Image', 'Created_at']
    search_fields = ['username','Unique_Id','Name', 'Auth_Key', 'State', 'Pin', 'City', 'Subdivision']
    list_filter = ['Type', 'Has_Antivenom', 'State', 'District']
    fields = ['Username', 'Name', 'Type', 'Emergency_Number', 'Toll_Free_Number', 'Helpline_Number', 'Contacts', 'Address', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Oxygen_Remaining_Time', 'Has_Antivenom', 'Website', 'Latitude', 'Longitude', 'Image']
admin.site.register(Hospital, HospitalAdmin)


class BloodBankAdminForm(forms.ModelForm):
    Blood_Availability= HStoreFormField()

    class Meta:
        model = BloodBank
        fields = ['Username', 'Name', 'Ownership', 'Emergency_Number', 'Toll_Free_Number', 'Helpline_Number', 'Contacts', "Blood_Availability", 'Address', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Website', 'Latitude', 'Longitude']

class BloodBankAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Name', 'Unique_Id', 'Ownership', 'Address', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Latitude', 'Longitude', 'Created_at', ]
    search_fields = ['username','Unique_Id','Name', 'State', 'Pin' 'City', 'Subdivision']
    list_filter = ['Ownership', 'State', 'District']
    form = BloodBankAdminForm
admin.site.register(BloodBank, BloodBankAdmin)


class BloodDonationCampAdminForm(ModelForm):
    class Meta:
        model = BloodDonationCamp
        fields = []
class BloodDonationCampAdmin(admin.ModelAdmin):
    list_display = ['Organizer', 'Organizer_Contact', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Landmark', 'Start_Date', 'End_Date', ]
    search_fields = ['Organizer','Organizer_Contact', 'Pin' 'City', 'Subdivision', 'Landmark']
    list_filter = ['State', 'District']
    #form = BloodDonationCampAdminForm
admin.site.register(BloodDonationCamp, BloodDonationCampAdmin)


class CampReminderAdmin(admin.ModelAdmin):
    list_display = ['Mobile']
admin.site.register(CampReminder, CampReminderAdmin)


class DoctorAdminForm(ModelForm):
    class Meta:
        model = Doctor
        fields = []
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Name', 'Gender', 'Blood_Group', 'Special', 'Permanent_State', 'Permanent_City', 'Permanent_Subdivision', 'Permanent_District', 'Permanent_Pin', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Image', 'Created_at', 'Last_Update']
    list_filter = ['Gender', 'Blood_Group', 'Special', 'Permanent_State', 'Permanent_District', 'State', 'District']
    search_fields = ['Username', 'Name', 'Permanent_City', 'Permanent_Subdivision', 'Permanent_Pin', 'City', 'Subdivision', 'Pin']
    #form = DoctorAdminForm
admin.site.register(Doctor, DoctorAdmin)


class DoctorRatingRecordAdmin(admin.ModelAdmin):
    list_display = ['Doctor_ID', 'Rate', 'Person', 'timestamp']
admin.site.register(DoctorRatingRecord, DoctorRatingRecordAdmin)


class BloodAdminForm(ModelForm):
    class Meta:
        model = Blood_Donar
        fields = []
class BloodAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Name', 'Gender', 'Blood_Group', 'Date_of_Birth', 'Permanent_State', 'Permanent_City', 'Permanent_Subdivision', 'Permanent_District', 'Permanent_Pin', 'State', 'City', 'Subdivision', 'District', 'Pin', 'Image', 'Created_at', 'Last_Update']
    list_filter = ['Gender', 'Blood_Group', 'Permanent_State', 'Permanent_District', 'State', 'District']
    search_fields = ['Username', 'Name', 'Permanent_City', 'Permanent_Subdivision', 'Permanent_Pin', 'City', 'Subdivision', 'Pin']
    #form = BloodAdminForm
admin.site.register(Blood_Donar, BloodAdmin)


class BloodDonationCollectionRecordAdmin(admin.ModelAdmin):
    list_display = ['Certificate_Id', 'Name', 'Phone', 'Email', 'Gender', 'Age', 'Blood_Group', 'Unit', 'Component', 'Blood_Bank', 'Certificate', 'Certificate_issued_for', 'Issued_at']
    list_filter = ['Blood_Group', 'Certificate_issued_for']
    search_fields = ['Certificate_Id', 'Email', 'Blood_Bank']
    fields = ['Email', 'Blood_Group', 'Blood_Bank', 'Certificate']
admin.site.register(BloodDonationCollectionRecord, BloodDonationCollectionRecordAdmin)

class CourseOffererAdmin(admin.ModelAdmin):
    list_display = ['Name', 'Logo', 'URL']
admin.site.register(CourseOfferer, CourseOffererAdmin)

class CourseInstructorAdmin(admin.ModelAdmin):
    list_display = ['username', 'Name', 'Image', 'Profession', 'Works_at', 'facebook_username', 'twitter_username', 'linkedin_username']
admin.site.register(CourseInstructor, CourseInstructorAdmin)


class FirstaidPhotoCourseAdmin(admin.ModelAdmin):
    list_display = ['Course_Id', 'Name', 'Language', 'Level', 'Photo', 'Last_Update', 'Created']
admin.site.register(FirstaidPhotoCourse, FirstaidPhotoCourseAdmin)

class FirstaidPhotoAdmin(admin.ModelAdmin):
    list_display = ['SL_No', 'Name', 'Course', 'Upload_Photo']
admin.site.register(FirstaidPhoto, FirstaidPhotoAdmin)


class FirstaidVideoCourseAdmin(admin.ModelAdmin):
    list_display = ['Course_Id', 'Name', 'Offered_By', 'Instructor', 'Language', 'Level', 'Photo', 'Last_Update', 'Created']
admin.site.register(FirstaidVideoCourse, FirstaidVideoCourseAdmin)

class FirstaidVideoSectionAdmin(AdminVideoMixin, admin.ModelAdmin):
    list_display = ['SL_No', 'Name', 'Course']
admin.site.register(FirstaidVideoSection, FirstaidVideoSectionAdmin)

class FirstaidVideoAdmin(AdminVideoMixin, admin.ModelAdmin):
    list_display = ['SL_No', 'Name', 'Course', 'Section', 'Video']
admin.site.register(FirstaidVideo, FirstaidVideoAdmin)


class UserFeedbackAdminForm(ModelForm):
    class Meta:
        model = UserFeedback
        fields = []
class UserFeedbackAdmin(admin.ModelAdmin):
    list_display = ['Email', 'Feedback', 'Added_at']
    form = UserFeedbackAdminForm
admin.site.register(UserFeedback, UserFeedbackAdmin)


class ContactUsAdminForm(ModelForm):
    class Meta:
        model = ContactUs
        fields = []
class ContactUsAdmin(admin.ModelAdmin):
    list_display = ['Name', 'Phone', 'Email', 'Message', 'Contact_Time']
    # form = ContactUsAdminForm
admin.site.register(ContactUs, ContactUsAdmin)


class ComplaintAdminForm(ModelForm):
    class Meta:
        model = Complaint
        fields = []
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['Complain_Id', 'Name', 'Email', 'Phone', 'Address', 'State', 'District', 'City', 'Pin', 'Attachment', 'Subject', 'Complain', 'Complaint_Time']
    #form = ComplaintAdminForm
admin.site.register(Complaint, ComplaintAdmin)


class ComplaintRepliesAdmin(admin.ModelAdmin):
    list_display = ['id', 'Text']
    fields = ['Text', 'Attachments']
admin.site.register(ComplaintReplyReplies, ComplaintRepliesAdmin)

class ComplaintReplyAttachmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'Reply_Attachment',]
    fields = ['Reply_Attachment']
admin.site.register(ComplaintReplyAttachment, ComplaintReplyAttachmentAdmin)


class PatientDataAdminForm(ModelForm):
    class Meta:
        model = PatientData
        fields = []
class PatientDataAdmin(admin.ModelAdmin):
    list_display = ['Booking_ID', 'Username', 'Booked_By', 'Patient_Name', 'Disease', 'Hospital_Name', 'Gender', 'Age', 'Mobile', 'Alternative_Mobile', 'Email', 'State', 'District', 'Subdivision', 'Pin', 'Bed_No', 'Status', 'Booking_Time', 'Admit_Time', 'Status_Changed_At', 'Expire_Time', 'Is_Checked', 'QR', 'When_Checked']
    search_fields = ['Booking_ID', 'Username', 'Patient_Name', 'Disease', 'Hospital_Name', 'Mobile', 'Email', 'Subdivision', 'Subdivision', 'Pin', 'Bed_No']
    list_filter = ['Status', 'Booked_By', 'Is_Checked']
    #form = PatientDataAdminForm
admin.site.register(PatientData, PatientDataAdmin)

class ReferredPatientAdmin(admin.ModelAdmin):
    list_display = ['ReferredDate']
admin.site.register(ReferredPatient, ReferredPatientAdmin)


class EmergencyAdmin(admin.ModelAdmin):
    list_display = ['Office', 'Person', 'Person_Designation', 'State', 'District', 'Subdivision', 'Contact']
admin.site.register(Emergency_Number, EmergencyAdmin)

class DiseaseAdmin(admin.ModelAdmin):
    list_display = ['Disease',]
admin.site.register(Disease, DiseaseAdmin)

class SomeCommonDiseaseAdmin(admin.ModelAdmin):
    list_display = ['Disease', "Concerned_Department"]
admin.site.register(SomeCommonDisease, SomeCommonDiseaseAdmin)

class HospitalDepartmentAdmin(admin.ModelAdmin):
    list_display = ['department',]
admin.site.register(HospitalDepartment, HospitalDepartmentAdmin)

class HospitalBuildingAdmin(admin.ModelAdmin):
    list_display = ['Building', 'Hospital']
admin.site.register(HospitalBuilding, HospitalBuildingAdmin)

class HospitalRoomAdmin(admin.ModelAdmin):
    list_display = ['Room', 'Hospital']
admin.site.register(HospitalRoom, HospitalRoomAdmin)

class HospitalUnitAdmin(admin.ModelAdmin):
    list_display = ['Unit', 'Hospital']
admin.site.register(HospitalUnit, HospitalUnitAdmin)

class BedNoAdmin(admin.ModelAdmin):
    list_display = ['Hospital', 'Bed_No', 'Department', 'Ward', 'Support', 'Room', 'Unit', 'Floor', 'Building', 'Availability', 'Book_by', 'Booking_Id', 'Last_Update']
    search_fields = ['Hospital', 'Bed_No', 'Building']
    list_filter = ['Ward', 'Floor', 'Support', 'Availability']
    fields = ['Hospital', 'Bed_No', 'Department', 'Ward', 'Support', 'Room', 'Unit', 'Floor', 'Building', 'Availability']
admin.site.register(BedNo, BedNoAdmin)

class BedRemoveRequestsAdmin(admin.ModelAdmin):
    list_display = ['Status', 'Bed', 'requested_at']
admin.site.register(BedRemoveRequests, BedRemoveRequestsAdmin)


# class ChatAdmin(admin.ModelAdmin):
#     list_display = ["From", "To"]
# admin.site.register(Chat, ChatAdmin)


class StateAdmin(admin.ModelAdmin):
    list_display = ['Name', 'Is_Union_Territory']
admin.site.register(States, StateAdmin)

class DistrictAdmin(admin.ModelAdmin):
    list_display = ['Name', 'state']
admin.site.register(Districts, DistrictAdmin)

class DegreeAdmin(admin.ModelAdmin):
    list_display = ['Degree',]
admin.site.register(Degrees, DegreeAdmin)

class SpecialityAdmin(admin.ModelAdmin):
    list_display = ['Speciality', 'Degree']
admin.site.register(Specialities, SpecialityAdmin)

class LanguageAdmin(admin.ModelAdmin):
    list_display = ['Language',]
admin.site.register(Languages, LanguageAdmin)

class TotalVisitorAdminForm(ModelForm):
    class Meta:
        model = TotalVisitor
        fields = []
class totalAdmin(admin.ModelAdmin):
    list_display = ['Total',]
    form = TotalVisitorAdminForm
admin.site.register(TotalVisitor, totalAdmin)


class BloodRequestAdminForm(ModelForm):
    class Meta:
        model = BloodRequest
        fields = []
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ['Patient_Name', 'Blood_Group', 'Contact', 'Admit_Hospital', 'Username', 'Requested_at']
    search_fields = ['Patient_Name', 'Contact', 'Admit_Hospital']
    list_filter = ['Blood_Group',]
    #form = BloodRequestAdminForm
admin.site.register(BloodRequest, BloodRequestAdmin)


class PeopleVoiceAdminForm(ModelForm):
    class Meta:
        model = PeopleVoice
        fields = []
class PeopleVoiceAdmin(admin.ModelAdmin):
    list_display = ['id', 'hospital', 'Text', 'Is_Approved', 'created_at']
    search_fields = ['hospital',]
    form = PeopleVoiceAdminForm
admin.site.register(PeopleVoice, PeopleVoiceAdmin)


class SiteContactAdmin(AdminVideoMixin, admin.ModelAdmin):
    list_display = ['Contact_Number', 'Contact_For', 'is_24x7', 'is_main', 'added']
admin.site.register(SiteContact, SiteContactAdmin)

class SiteEmailAdmin(AdminVideoMixin, admin.ModelAdmin):
    list_display = ['EmailId', 'Mail_For', 'is_main', 'added']
admin.site.register(SiteEmail, SiteEmailAdmin)

class WhatsappNumberAdmin(AdminVideoMixin, admin.ModelAdmin):
    list_display = ['Whatsapp_Number']
admin.site.register(WhatsappNumber, WhatsappNumberAdmin)

class WorkingHourAdmin(AdminVideoMixin, admin.ModelAdmin):
    list_display = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
admin.site.register(WorkingHour, WorkingHourAdmin)


class LogEntryAdminForm(ModelForm):
    class Meta:
        model = LogEntry
        fields = []
class LogEntryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in LogEntry._meta.get_fields()]
    form = LogEntryAdminForm
admin.site.register(LogEntry, LogEntryAdmin)


class SessionAdminForm(ModelForm):
    class Meta:
        model = Session
        fields = []
class SessionAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Session._meta.get_fields()]
    form = SessionAdminForm
admin.site.register(Session, SessionAdmin)


class OTPAdmin(admin.ModelAdmin):
    list_display = ['Mobile', 'MobileOTP', 'Email', 'EmailOTP', 'Send_For', 'Is_Verified', 'expire', 'Added_at']
admin.site.register(OTP, OTPAdmin)
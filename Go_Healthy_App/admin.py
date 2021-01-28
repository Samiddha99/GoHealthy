from django.contrib import admin
from embed_video.admin import AdminVideoMixin
from .models import *
from .forms import *

# Register your models here.
class UsersAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'User_Type']
admin.site.register(Users, UsersAdmin)


class UserAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Name', 'Contact']
admin.site.register(Admin, UserAdmin)


class NormalUserAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Name', 'Contact']
admin.site.register(NormalUser, NormalUserAdmin)

class HospitalAdmin(admin.ModelAdmin):
    search_fields = ['username','Hospital_Id','Name']
    list_filter = ['Type']
    list_display = ['Username', 'Name', 'Hospital_Id', 'Name', 'Type', 'Contact', 'Address', 'State', 'Subdivision', 'District', 'Pin', 'Image', 'Created_at', 'Last_Update']
admin.site.register(Hospital, HospitalAdmin)



class DoctorAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Name', 'Registration_Number', 'Degree', 'Special', 'Contact', 'Address', 'State', 'District', 'Subdivision', 'Pin', 'Image', 'Created_at', 'Last_Update']
admin.site.register(Doctor, DoctorAdmin)



class BloodAdmin(admin.ModelAdmin):
    list_display = ['Username', 'Name', 'Blood_Group', 'Contact', 'ID_Type', 'ID_Number', 'Address', 'State', 'District', 'Subdivision', 'Pin', 'Image', 'Created_at', 'Last_Update']
admin.site.register(Blood_Donar, BloodAdmin)


class FirstaidPhotoAdmin(admin.ModelAdmin):
    list_display = ['Name', 'Upload_Photo', 'Language']
admin.site.register(FirstaidPhoto, FirstaidPhotoAdmin)

class FirstaidVideoAdmin(AdminVideoMixin, admin.ModelAdmin):
    list_display = ['Name', 'Video', 'Language']
admin.site.register(FirstaidVideo, FirstaidVideoAdmin)

class ContactUsAdmin(admin.ModelAdmin):
    list_display = ['Name', 'Phone', 'Email', 'Message', 'Contact_Time']
admin.site.register(ContactUs, ContactUsAdmin)

class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['Name', 'Email', 'Phone', 'Address', 'State', 'District', 'City', 'Pin', 'Attachment', 'Complain', 'Complaint_Time']
admin.site.register(complaint, ComplaintAdmin)

class BedBookAdmin(admin.ModelAdmin):
    list_display = ['Booking_ID','Patient_Name', 'Hospital_Name', 'Bed_No', 'Gender', 'Mobile', 'Alternative_Mobile', 'Email', 'Address', 'State', 'District', 'Pin', 'Bed_No', 'Booking_Time', 'Status']
admin.site.register(Bed_Book, BedBookAdmin)

class NoticeAdmin(admin.ModelAdmin):
    list_display = ['Catagory', 'Name', 'File']
admin.site.register(Notification_Notice_and_Event, NoticeAdmin)

class EmargencyAdmin(admin.ModelAdmin):
    list_display = ['Office', 'Person', 'Person_Designation', 'State', 'District', 'Subdivision', 'Contact', 'Contact_1', 'Contact_2', 'Contact_3', 'Contact_4', 'Contact_5']
admin.site.register(Emargency_Number, EmargencyAdmin)


class BedNoAdmin(admin.ModelAdmin):
    list_display = ['Hospital', 'Bed_No', 'Flor', 'Room', 'Building', 'Availability']
admin.site.register(BedNo, BedNoAdmin)

class BedRemoveAdmin(admin.ModelAdmin):
    list_filter = ['Hospital', 'Bed']
admin.site.register(BedRemove, BedRemoveAdmin)

class ChatAdmin(admin.ModelAdmin):
    list_display = ["From", "To"]
admin.site.register(Chat, ChatAdmin)

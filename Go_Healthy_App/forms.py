from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, PasswordChangeForm, PasswordResetForm
from django.contrib.auth import get_user_model
from .models import *
from .choice import *

class ContactUsForm(forms.ModelForm):
    #Message = forms.Textarea()
    #Phone = forms.CharField(widget=forms.TextInput(attrs={'placeholder': '10 digit Mobile No'}))
    #Email = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'example@gmail.com'}))
    class Meta:
        model = ContactUs  #Link the ContactUs Model here in
        fields = ("Name", "Phone", "Email", "Message") #Model's Fields for Form
        widgets = {
            'Message': forms.Textarea(attrs={'cols': 30, 'rows': 4})
        }

class ComplaintForm(forms.ModelForm):
    class Meta:
        model = complaint #Link the complaint Model here
        fields = ("Name", "Email", "Phone", "Address", "City", 'Subdivision', 'State', 'District', "Pin", "Subject", "Complain")
        help_texts = {'Attachment': "If you have any document or proof regarding your complaint, then please attach it.", }
        Name = forms.CharField(max_length=50, widget = forms.TextInput(attrs={'placeholder':'Your Name'})),

        widgets = {
            'Address': forms.Textarea(attrs={'cols': 50, 'rows': 3}),
            'Complain': forms.Textarea(attrs={'cols': 50, 'rows': 5})
        }

class BedBookForm(forms.ModelForm):
    class Meta:
        model = Bed_Book
        fields = ('Hospital_Name', 'Patient_Name', 'Gender', 'Mobile', 'Alternative_Mobile', 'Email', 'Address', 'State', 'District', 'Pin')
        widgets = {
            'Address': forms.Textarea(attrs={'cols': 25, 'rows': 3}),
        }


class UsersCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = Users
        fields = ('username', 'email', 'password1', 'password2')

class UsersPaswordChangeForm(PasswordChangeForm):
    class Meta(PasswordChangeForm):
        model = Users

class UsersPaswordResetForm(PasswordResetForm):
    class Meta(PasswordResetForm):
        model = Users


class DonorCreationForm(forms.ModelForm):
    class Meta:
        model = Blood_Donar
        fields = ('Name', 'Gender', 'Date_of_Birth', 'Blood_Group', 'Contact', 'ID_Type', 'ID_Number', 'City', 'Address', 'State', 'Subdivision', 'District', 'Pin')

class DoctorCreationForm(forms.ModelForm):
    class Meta:
        model = Doctor
        fields = ('Name', 'Registration_Number', 'Degree', 'Gender', 'Special', 'Contact', 'Address', 'City', 'State', 'Subdivision', 'District', 'Pin')

class HospitalImageUploadForm(forms.ModelForm):
    class Meta:
        model = Hospital
        fields = ('Image',)
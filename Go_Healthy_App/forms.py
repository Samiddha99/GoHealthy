from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, PasswordChangeForm, PasswordResetForm
from django.contrib.auth import get_user_model
from .models import *
from .choice import *


class UsersCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = Users
        fields = ('username', 'email', 'password1', 'password2', 'Contact', 'ID_Type', 'ID_Number')


class UsersPaswordChangeForm(PasswordChangeForm):
    class Meta(PasswordChangeForm):
        model = Users






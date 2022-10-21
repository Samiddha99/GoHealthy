from django.core.management.base import BaseCommand, CommandError
from django.db.models.expressions import F
from Go_Healthy_App.models import Users
from django.contrib.auth.hashers import make_password
import traceback
import getpass


class Command(BaseCommand):
    help = 'Create a new super user'

    # def add_arguments(self, parser):
    #     parser.add_argument('is_verified', type=str, help="Specified if the user is verified or not. [Options are: 'True', 'False']")

    def handle(self, *args, **kwargs):
        try:
            username = input('Username: ')
            if username == '' or username == None:
                raise CommandError("Username field can't be empty")
            email = input('Email: ').lower()
            if email == '' or email == None:
                raise CommandError("Email field can't be empty")
            contact = input('Contact: ')
            if contact == '' or contact == None:
                raise CommandError("Contact field can't be empty")
            elif len(contact) != 10:
                raise CommandError("Contact no should be 10 digit")
            password1 = getpass.getpass(prompt='Password: ')
            if password1 == '' or password1 == None:
                raise CommandError("Password field can't be empty")
            password2 = getpass.getpass(prompt='Confirm Password (Re-enter password): ')
            if password2 == '' or password2 == None:
                raise CommandError("Confirm Password field can't be empty")
            if password1 != password2:
                raise CommandError("Password and Confirm Password didn't matched")
            if Users.objects.filter(email=email).exists():
                raise CommandError("User with this email already exists")
            if Users.objects.filter(Contact=contact).exists():
                raise CommandError("User with this contact already exists")
            password = make_password(password1)
            Users(username=username, email=email, password=password, Contact=contact, User_Type=["Site Admin",], is_verified=True, is_staff=True, is_superuser=True, is_active=True, ID_Type="", ID_Number=None).save()
            self.stdout.write(self.style.SUCCESS('\nSuperuser Successfully Created'))
        except Exception as e:
            raise CommandError(e)
        except KeyboardInterrupt:
            self.stdout.write(self.style.ERROR('\n\nProcessing Terminated'))
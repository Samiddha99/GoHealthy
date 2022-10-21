from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import *

class MainStaticSitemap(Sitemap):
    changefreq = "weekly"
    priority = 1.0
    protocol = 'https'

    def items(self):
        return [
            'Go_Healthy_App:project-Home',
            'Go_Healthy_App:project-About',
            'Go_Healthy_App:FAQ',
            'Go_Healthy_App:project-Contact',
            'Go_Healthy_App:project-Hospital',
            'Go_Healthy_App:project-Doctor',
            'Go_Healthy_App:project-Blood',
            'Go_Healthy_App:BloodBank',
            'Go_Healthy_App:RequestedBlood',
            'Go_Healthy_App:Emergency',
            'Go_Healthy_App:LoginMain',
            'Go_Healthy_App:Register',
            'Go_Healthy_App:Register-Donor',
            'Go_Healthy_App:Register-Doctor',
            'Go_Healthy_App:BMI-Answer',
            'Go_Healthy_App:PeopleVoice',
            'Go_Healthy_App:project-Complain',
            'Go_Healthy_App:DataCenter',
        ]

    def location(self, item):
        return reverse(item)


class FirstAidStaticSitemap(Sitemap):
    changefreq = "weekly"
    priority = 1.0
    protocol = 'https'

    def items(self):
        return [
            'Go_Healthy_App:project-Firstaid',
            'Go_Healthy_App:firstaid-Photos',
            'Go_Healthy_App:firstaid-Videos',
        ]

    def location(self, item):
        return reverse(item)



class FirstAidPhotoSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return FirstaidPhotoCourse.objects.all()

    def lastmod(self, obj):
        return obj.Last_Update
    

class FirstAidVideoSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return FirstaidVideoCourse.objects.all()

    def lastmod(self, obj):
        return obj.Last_Update


class HospitalSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return Hospital.objects.all()

    def lastmod(self, obj):
        return obj.Last_Update


class BloodBankSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return BloodBank.objects.all()

    def lastmod(self, obj):
        return obj.Last_Changed
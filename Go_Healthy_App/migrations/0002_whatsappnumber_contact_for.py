# Generated by Django 3.2 on 2022-08-17 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Go_Healthy_App', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='whatsappnumber',
            name='Contact_For',
            field=models.CharField(default='General Enquiry', max_length=100),
            preserve_default=False,
        ),
    ]

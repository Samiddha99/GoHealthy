# Generated by Django 3.2 on 2023-07-06 11:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Go_Healthy_App', '0006_alter_hospital_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='peoplevoice',
            name='Is_Approved',
            field=models.BooleanField(default=False),
        ),
    ]

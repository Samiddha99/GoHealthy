from django.core.management.base import BaseCommand
from Go_Healthy_App.models import Degrees, Specialities

class Command(BaseCommand):
    help = 'Add Doctor Degree. Also can  Add Specialities'

    def add_arguments(self, parser):
        parser.add_argument('degree', type=str, help='Name of the degree, for which state we want to add specialities')

        # Optional argument
        parser.add_argument('-specialities', '--spl', type=str, help="Name of specialities, separated by coma (e.g. 'speciality1:speciality2')")

    def handle(self, *args, **kwargs):
        degree = kwargs['degree']
        specialities = kwargs['spl']
        degree_exist = '0'
        s = None
        try:
            if specialities is None:
                self.stdout.write(self.style.WARNING('WARNING! You are adding degree without specialities.'))
                if Degrees.objects.filter(Degree=degree).exists():
                    self.stdout.write(self.style.ERROR("Degree already exists!"))
                else:
                    Degrees(Degree=degree).save()
                    self.stdout.write(self.style.SUCCESS("Degree added successfully"))
            else:
                if Degrees.objects.filter(Degree=degree).exists():
                    degree_exist = '1'
                    self.stdout.write(self.style.WARNING("\n"+str(degree) + " is already exists."))
                    s = input("Press 'q' if you want to quit or press any other key to add the specialities to "+degree+": ")
                if(s == 'q'):
                    self.stdout.write(self.style.ERROR("Process Terminated"))
                elif(s != 'q' and degree_exist == '0'):
                    Degrees(Degree=degree).save()
                if(s != 'q'):
                    theDegree = Degrees.objects.get(Degree=degree)
                    specialities = specialities.split(":")
                    ln = str(len(specialities))
                    self.stdout.write(self.style.SUCCESS("You are adding "+ln+" specialities"))
                    for i in specialities:
                        if(Specialities.objects.filter(Speciality=i, Degree=theDegree).exists()):
                            self.stdout.write(self.style.WARNING(str(i) + " is already exists."))
                            spy = input("Press '1' if you want to skip this speciality, otherwise press any other key to add this speciality too.")
                            if(spy == '1'):
                                continue
                        Specialities(Speciality=i, Degree=theDegree).save()
                    if(degree_exist == '0'):
                        self.stdout.write(self.style.SUCCESS("Degree added successfully"))
                    self.stdout.write(self.style.SUCCESS('Specialities added to ' + str(degree)))
        except Exception as e:
            self.stdout.write(self.style.ERROR(e))
        except KeyboardInterrupt:
            self.stdout.write(self.style.ERROR('\n\nProcessing Terminated'))
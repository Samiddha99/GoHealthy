from django.core.management.base import BaseCommand
from Go_Healthy_App.models import States, Districts

class Command(BaseCommand):
    help = 'Add State. Also can  Add Districts'

    def add_arguments(self, parser):
        parser.add_argument('state', type=str, help='Name of the state, for which state we want to add districts')

        # Optional argument
        parser.add_argument('-d', '--districts', type=str, help='Name of districts, separated by coma (e.g. "district1,district2")')

    def handle(self, *args, **kwargs):
        state = kwargs['state']
        districts = kwargs['districts']
        dis = ''
        state_exist = '0'
        s = None
        try:
            if districts is None:
                self.stdout.write(self.style.WARNING('WARNING! You are adding state without districts.'))
                if States.objects.filter(Name=state).exists():
                    self.stdout.write(self.style.ERROR("State already exists!"))
                else:
                    u = input("Is Union Territory? (default No) [y/n]: ")
                    if (u == 'y'):
                        States(Name=state, Is_Union_Territory=True).save()
                    else:
                        States(Name=state, Is_Union_Territory=False).save()
                    self.stdout.write(self.style.SUCCESS("State added successfully"))
            else:
                if States.objects.filter(Name=state).exists():
                    state_exist = '1'
                    self.stdout.write(self.style.WARNING("\n"+str(state) + " is already exists."))
                    s = input("Press 'q' if you want to quit or press any other key to add the districts to "+state+": ")
                if(s == 'q'):
                    self.stdout.write(self.style.ERROR("Process Terminated"))
                elif(s != 'q' and state_exist == '0'):
                    u = input("Is Union Territory? (default No) [y/n]: ")
                    if(u == 'y'):
                        States(Name=state, Is_Union_Territory=True).save()
                    else:
                        States(Name=state, Is_Union_Territory=False).save()
                if(s != 'q'):
                    theState = States.objects.get(Name=state)
                    districts = districts.split(",")
                    for i in districts:
                        if(Districts.objects.filter(Name=i, state=theState).exists()):
                            self.stdout.write(self.style.WARNING(str(i) + " is already exists."))
                            dis = input("Press '1' if you want to skip this district, otherwise press any other key to add this district too.")
                            if(dis == '1'):
                                continue
                        Districts(Name=i, state=theState).save()
                    if(state_exist == '0'):
                        self.stdout.write(self.style.SUCCESS("State added successfully"))
                    self.stdout.write(self.style.SUCCESS('Districts added to ' + str(state)))
        except Exception as e:
            self.stdout.write(self.style.ERROR(e))
        except KeyboardInterrupt:
            self.stdout.write(self.style.ERROR('\n\nProcessing Terminated'))
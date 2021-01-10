
#from apscheduler.schedulers.background import BackgroundScheduler
import time
from timeloop import Timeloop
from datetime import timedelta
from background_task import background
from Go_Healthy_App.scheduletasks import tasks




def start():
    tasks.deleteOTP()

    tasks.deleteResetLink()

    tasks.bookExpireAlert()

    tasks.expireBooking()

    tasks.multipleBookingWarning()

    tasks.deleteExpireBooking()

    tasks.deleteRealese()

    tasks.deleteNonVerifyUser()

    tasks.changeBedNo()

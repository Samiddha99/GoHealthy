
from apscheduler.schedulers.background import BackgroundScheduler
import time
from timeloop import Timeloop
from datetime import timedelta
from background_task import background
from Go_Healthy_App.scheduletasks import tasks




def start():
    scheduler1 = BackgroundScheduler()
    scheduler1.add_job(tasks.deleteOTP, 'interval', seconds=1)
    scheduler1.start()

    scheduler2 = BackgroundScheduler()
    scheduler2.add_job(tasks.deleteResetLink, 'interval', seconds=1)
    scheduler2.start()

    scheduler3 = BackgroundScheduler()
    scheduler3.add_job(tasks.bookExpireAlert, 'interval', seconds=1)
    scheduler3.start()

    scheduler4 = BackgroundScheduler()
    scheduler4.add_job(tasks.expireBooking, 'interval', minutes=10)
    scheduler4.start()

    scheduler5 = BackgroundScheduler()
    scheduler5.add_job(tasks.multipleBookingWarning, 'interval', minutes=30)
    scheduler5.start()

    scheduler6 = BackgroundScheduler()
    scheduler6.add_job(tasks.deleteExpireBooking, 'interval', days=1)
    scheduler6.start()

    scheduler7 = BackgroundScheduler()
    scheduler7.add_job(tasks.deleteRealese, 'interval', days=100)
    scheduler7.start()

    scheduler8 = BackgroundScheduler()
    scheduler8.add_job(tasks.deleteNonVerifyUser, 'interval', days=50)
    scheduler8.start()

    scheduler9 = BackgroundScheduler()
    scheduler9.add_job(tasks.changeBedNo, 'interval', minutes=1)
    scheduler9.start()

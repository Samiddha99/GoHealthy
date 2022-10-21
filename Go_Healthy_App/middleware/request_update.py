from django.shortcuts import render, redirect
import re
from Go_Healthy_App.utils import * 


class FormatPostData():

    def __init__(self, get_response):
        self.get_response = get_response

    def process_request(self, request):
        # This code is executed just before the view is called to process the requests
        if request.method == 'POST':
            request_post_data = request.POST
            # get the current state
            _mutable = request.POST._mutable
            # make it mutable
            request.POST._mutable = True # POST data is always immutable, so to make update on post data we have to set the POST data to mutable

            for key, value in request_post_data.items():
                multiple_space_replaced_string = re.sub(' +', ' ', str(value)) # remove any number of space occurrences with a single space
                multiple_space_replaced_string = multiple_space_replaced_string.strip() # remove leading and trailing whitespaces
                multiple_new_line_replaced_string = re.sub('\n+', '\n', multiple_space_replaced_string) # remove any number of new line occurrences with one new line
                multiple_new_line_replaced_string = multiple_new_line_replaced_string.strip("\n") # remove leading and trailing new line
                request.POST[key] = multiple_new_line_replaced_string
            # set mutable to previous state
            request.POST._mutable = _mutable
        return request

    def process_response(self, request, response):
        # After the view has finished executing, this code is executed to process the response.
        return response

    def __call__(self, request):

        # Code to be executed for each request before the view (and later middleware) are called.
        request =  self.process_request(request)

        response = self.get_response(request)

        # Code to be executed for each request/response after the view is called.
        response =  self.process_response(request, response)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # This code is executed just before the view is called
        pass   

    def process_template_response(self, request, response):
        # After the view has finished executing, this code is executed if the response contains a render() method
        return response

    def process_exception(self, request, exception):
        # This code is executed if an exception is raised
        pass
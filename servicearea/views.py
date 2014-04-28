from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello from django, try out <a href='/static/index.html'>Service Area</a>\n")

from django.shortcuts import render
from .models import Message


def home(request):
    messages = reversed(Message.objects.all().order_by('-timestamp')[:10])
    return render(request, "index.html", {
        'messages': messages,
    })

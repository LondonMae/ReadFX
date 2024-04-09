from django.urls import path, re_path
from . import views

urlpatterns = [
path("", views.index, name="index"),
path('extract_content/', views.extract_content, name='extract_content'),
re_path(r'^get_wiki_summary/$', views.get_wiki_summary, name='get_wiki_summary'),
]

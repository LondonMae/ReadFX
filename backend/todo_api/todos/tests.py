from django.test import TestCase
from .models import Todo

# Create your tests here.
class TodoModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        Todo.objects.create(title="first todo")
        Todo.objects.create(description="desc here!")

    def test_title_content(self):
        todo = Todo.objects.get(id=1)
        expected_object_name = f'{todo.title}'
        self.assertEquals(expected_object_name, "first todo")

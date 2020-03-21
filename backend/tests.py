  
from django.contrib.staticfiles.testing import StaticLiveServerTestCase

# Create your tests here.

class e2eTest(StaticLiveServerTestCase):
    def setUpClass(self):
        super().setUpClass()

    def tearDownClass(self):
        super().tearDownClass()
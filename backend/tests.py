from django.contrib.staticfiles.testing import StaticLiveServerTestCase

# Create your tests here.

class e2eTest(StaticLiveServerTestCase):
    def setUpClass(cls):
        super().setUpClass()

    def tearDownClass(cls):
        super().tearDownClass()
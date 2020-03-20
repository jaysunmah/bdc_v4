from django.test import TestCase

# Create your tests here.
from backend.modules.tdameritrade import helloworld

class AnimalTestCase(TestCase):
	def test_isPrime(self):
		self.assertEqual(helloworld.isPrime(3), True)
		self.assertEqual(helloworld.isPrime(4), False)
		self.assertEqual(helloworld.isPrime(9), False)
		self.assertEqual(helloworld.isPrime('fsfasf', False)

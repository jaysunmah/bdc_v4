from django.test import TestCase
from backend.modules.tdameritrade import helloworld

# Create your tests here.

class AnimalTestCase(TestCase):
	def test_isPrime(self):
		self.assertEqual(helloworld.isPrime(3), True)
		self.assertEqual(helloworld.isPrime(4), False)
		self.assertEqual(helloworld.isPrime(9), False)
		self.assertEqual(helloworld.isPrime('test'), False)

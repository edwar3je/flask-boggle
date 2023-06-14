from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    
    def test_row_length(self):
        boggle = Boggle()
        board = boggle.make_board()
        self.assertEqual(len(board), 5)
        self.assertTrue(board)

class FlaskTests2(TestCase):

    def setUp(self):
        board = [['B','A','D','L','Y'],['F','K','I','M','Z'],['T','Y','U','W','L'],['A','N','B','V','X'],['R','S','C','P','E']]
    
    def tearDown(self):
        board = []
    
    def test_handle_ok_word(self):
        fff
    
    def test_handle_not_on_board(self):
        fff

    def test_handle_not_word(self):
        fff
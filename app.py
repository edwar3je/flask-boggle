from boggle import Boggle
from flask import Flask, request, render_template, flash, session, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = 'here is the secret key'

boggle_game = Boggle()

@app.route('/game')
def display_game():
    """Creates the game board, stores the game board in session and creates a Jinja template of the game board."""
    session['board'] = boggle_game.make_board()
    return render_template('game.html', gameboard = session['board'])

@app.route('/game/handle', methods=["POST"])
def handle_game():
    """Extracts the json post request data, provides a response based on the data and returns the response."""
    content = request.get_json(force=True)
    term = content['word']

    #Determines if the request is either a valid word and on the board ('ok'), a valid word, but not on the board
    #('not-on-board') or not a valid word ('not-word').
    answer = boggle_game.check_valid_word(session['board'], term)
    
    #Returns the response of boggle_game.check_valid_word() to Jinja template.
    return jsonify(answer)
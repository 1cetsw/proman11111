from functools import wraps

from flask import Flask, render_template, url_for, session, flash, request, redirect, jsonify, make_response
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries
from data_manager import connect_login
import psycopg2.extras
import re
from werkzeug.security import generate_password_hash, check_password_hash
from flask import jsonify

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = 'lubie0placki'
load_dotenv()


# ROUTES BOARDS____________________________________________________________________________________________________
@app.route("/")
def index():
    return render_template('index.html')


@app.route("/api/boards/public")
@json_response
def public_boards():
    """
    All PUBLIC the boards
    """
    return queries.public_boards()


@app.route("/api/boards/private")
@json_response
def private_boards():
    """
        All PUBLIC + USER the boards
        """
    user_id = request.args['user']
    return queries.private_boards(user_id)


@app.route("/api/new_board", methods=['POST'])
def add_new_board():
    data = request.get_json()
    id = queries.add_new_board(data['title'], data['user_id'])
    return jsonify(id)


@app.route("/api/rename_board", methods=['POST'])
def rename_board():
    data = request.get_json()
    rename_data = queries.rename_element(data, 'boards')
    return rename_data


# ROUTES CARDS_________________________________________________________________________________________________________
@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    return queries.get_cards_for_board(board_id)


@app.route("/api/new_card", methods=['POST'])
def add_new_card():
    data = queries.add_new_card(request.get_json(), request.get_json()['status'])
    return request.get_json()


@app.route('/api/rename_card', methods=['POST'])
def rename_card():
    data = request.get_json()
    return jsonify(queries.name_changer(data, 'cards'))


@app.route("/api/column", methods=['POST'])
def add_column():
    data = request.get_json()
    return jsonify(queries.add_column(data))


@app.route("/api/rename_column", methods=['POST'])
def rename_column():
    data = request.get_json()
    updated_data = queries.name_changer(data, 'statuses')
    return updated_data


@app.route("/api/delete_column/<int:column_id>", methods=["DELETE"])
def delete_column(column_id: int):
    id = queries.delete_column(column_id)
    return jsonify(id)


@app.route("/api/delete_card", methods=["DELETE"])
def delete_card():
    data = request.get_json()
    card = queries.delete_card(data['id'])
    return jsonify(card)


@app.route("/api/change_card_order", methods=['POST'])
def change_card_order():
    data = request.get_json()
    if len(data) == 2:
        queries.change_card_order(data['card_id'], data['order_status'])
    else:
        queries.change_cards_order(data['card_status'], data['order_status'], data['board_status'], data['status'])

    return request.get_json()


# ROUTES STATUSES_____________________________________________________________________________________________________
@app.route("/api/getStatuses", methods=["POST"])
def get_statuses():
    data = request.get_json()
    statuses = queries.get_statuses(data['boardId'])
    return jsonify(statuses)


@app.route("/api/change_card_status", methods=['POST'])
def change_card_status():
    queries.change_card_status(request.get_json()['card_id'], request.get_json()['card_status'])
    return request.get_json()


@app.route("/api/delete_board/<int:board_id>", methods=["DELETE"])
def delete_board(board_id: int):
    queries.delete_board(board_id)
    queries.delete_cards(board_id)
    return request.get_json()


@app.route('/api/get_board', methods=['POST'])
def get_board():
    data = request.get_json()
    return jsonify(queries.get_board(data['id']))


# REGISTER/LOGIN MODULE____________________________________________________________________________________________
conn = connect_login()


def home():
    if 'loggedin' in session:
        return render_template('index.html', username=session['username'])
    return redirect(url_for('login'))


@app.route('/login/', methods=['GET', 'POST'])
def login():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        password = request.form['password']
        print(password)
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        account = cursor.fetchone()
        if account:
            password_rs = account['password']
            print(password_rs)
            if check_password_hash(password_rs, password):
                session['loggedin'] = True
                session['id'] = account['id']
                session['username'] = account['username']
                return redirect(url_for('index'))
            else:
                flash('Incorrect username/password')
        else:
            flash('Incorrect username/password')
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form:

        fullname = request.form['fullname']
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        _hashed_password = generate_password_hash(password)

        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        account = cursor.fetchone()
        print(account)

        if account:
            flash('Account already exists!')
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            flash('Invalid email address!')
        elif not re.match(r'[A-Za-z0-9]+', username):
            flash('Username must contain only characters and numbers!')
        elif not username or not password or not email:
            flash('Please fill out the form!')
        else:
            cursor.execute("INSERT INTO users (fullname, username, password, email) VALUES (%s,%s,%s,%s)",
                           (fullname, username, _hashed_password, email))
            conn.commit()
            flash('You have successfully registered!')
    elif request.method == 'POST':

        flash('Please fill out the form!')

    return render_template('register.html')


@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('username', None)
    return redirect(url_for('index'))


@app.route('/profile')
def profile():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if 'loggedin' in session:
        cursor.execute('SELECT * FROM users WHERE id = %s', [session['id']])
        account = cursor.fetchone()
        return render_template('profile.html', account=account)
    return redirect(url_for('login'))


def login_required(function):
    @wraps(function)
    def wrap(*args, **kwargs):
        if 'id' in session:
            return function(*args, **kwargs)
        else:
            flash("You are not logged in")
            return redirect(url_for('login'))

    return wrap


def already_logged_in(function):
    @wraps(function)
    def wrap(*args, **kwargs):
        if 'id' not in session:
            return function(*args, **kwargs)
        else:
            flash(f"You are already logged in, {session['username']}")
            return redirect(url_for('login_page'))

    return wrap


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()

from main import app
from flask import request, make_response, render_template
from itertools import chain

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/user/<name>')
def user(name):
    return render_template('user.html', username = name)

@app.route('/request')
def req():
    response = make_response("\n".join([f'<div>{key}: {value}</div>' for key, value in chain(request.headers.items(), request.cookies.to_dict().items())]))
    # response.set_cookie('answer', '42')
    return response

@app.route('/bad')
def bad():
    return '<h1>Bad Request!</h1>', 400

@app.errorhandler(404)
def page_not_found(e):
    return render_template('PageNotFound.html'), 400

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('ServerError.html'), 500
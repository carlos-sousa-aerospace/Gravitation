from flask import Flask

app = Flask(__name__)

from routing import *

if __name__ == '__main__':
    app.run(debug=True, port='8005', host='127.0.0.1')
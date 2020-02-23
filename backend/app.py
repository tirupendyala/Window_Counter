from flask import Flask  # importing flask class
from flask_cors import CORS  # importing cross originating resource

# flask initialization
app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.secret_key = "secret key"
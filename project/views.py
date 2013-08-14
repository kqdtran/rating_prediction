"""
views imports app, auth, and models, but none of these import views
"""
from flask import render_template, redirect, request, url_for, jsonify
from flask.ext.classy import FlaskView

from app import app
from auth import auth
from models import User

# Classifier, CSV Loading
from pattern.vector import Document, NB
from pattern.db import Datasheet

# Load classifier
nb = NB.load("project/data/amazonClassifier")

@app.route('/classify', methods=['POST'])
def classify_review():
	text = request.form.get('text')
	return jsonify(result=nb.classify(text.strip()))

class BaseView(FlaskView):
  '''Basic views, such as the home and about page.'''
  route_base = '/'

  def index(self):
    return render_template('home.html')

BaseView.register(app)

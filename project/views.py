"""
views imports app, auth, and models, but none of these import views
"""
from flask import render_template, redirect, request, url_for, jsonify
from flask.ext.classy import FlaskView

from app import app
from auth import auth
from models import User

# For sentiment analysis
from text.blob import TextBlob

@app.route('/sentiment', methods=['POST'])
def compute_sentiment():
	"""Compute the sentiment"""

	text = request.form.get('text')
	all_text = TextBlob(text)
	polarity, subjectivity = all_text.sentiment 
	return jsonify(result=polarity)

@app.route('/sentiment/sentences', methods=['POST'])
def compute_sentiment_sentences():
	"""Compute the sentiment of each sentence.
	Currently not used, but will soon be in a future version"""

	text = request.form.get('text')
	all_text = TextBlob(text)
	return jsonify(result=[{'sentence': sent.dict['raw'], 'sentiment': sent.dict['polarity']}  
		for sent in all_text.sentences])

@app.route('/subjectivity', methods=['POST'])
def compute_subjectivity():
	"""Compute the subjectivity"""

	text = request.form.get('text')
	all_text = TextBlob(text)
	polarity, subjectivity = all_text.sentiment 
	return jsonify(result=subjectivity)

class BaseView(FlaskView):
  '''Basic views, such as the home and about page.'''
  route_base = '/'

  def index(self):
    return render_template('home.html')

BaseView.register(app)

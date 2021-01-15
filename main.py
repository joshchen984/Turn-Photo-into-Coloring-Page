from flask import Flask, render_template, redirect, url_for, request
import cv2
import string
import random
import os

app = Flask(__name__)


def get_filename(length):
    """Generates a random filename for a file

    Args:
        length: Length of generated filename

    Returns:
        string: filename without an extension
    """
    chars = string.ascii_letters
    filename = ''.join([random.choice(chars) for _ in range(length)])
    return filename


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/get-edges', methods=["POST"])
def get_edges():
    return 'test'


if __name__ == '__main__':
    app.run()

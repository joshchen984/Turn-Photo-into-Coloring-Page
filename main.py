from flask import Flask, render_template, redirect, url_for, request
import cv2
import string
import random
import os
import io
import numpy as np
from config import Config, ProdConfig

app = Flask(__name__)
app.config.from_object(Config())
ALLOWED_EXTENSIONS = {'.jpg', '.png'}


def get_filename(length):
    """
    Generates a random filename for a file
    :param length: Length of generated filename
    :return: string: filename without an extension
    """
    chars = string.ascii_letters
    filename = ''.join([random.choice(chars) for _ in range(length)])
    return filename


def allowed_file(filename):
    _, ext = os.path.splitext(filename)
    if ext in ALLOWED_EXTENSIONS:
        return True
    return False


@app.route('/')
def index():
    return render_template('index.html')


def get_edges(img):
    """
    Takes in image and returns image of edges.
    :param img: np array of image
    :return: np array of edges
    """
    blur = cv2.bilateralFilter(img, 9, 100, 100)
    img_gray = cv2.cvtColor(blur, cv2.COLOR_BGR2GRAY)

    edges = cv2.Laplacian(img_gray, cv2.CV_16S, ksize=3)

    edges = cv2.convertScaleAbs(edges)
    return edges


@app.route('/find-edges', methods=["POST"])
def find_edges():
    img_file = request.files['image']
    if not allowed_file(img_file.filename):
        return redirect(url_for('index'))

    memory_file = io.BytesIO()
    img_file.save(memory_file)
    img_data = np.frombuffer(memory_file.getvalue(), dtype=np.uint8)
    img = cv2.imdecode(img_data, cv2.IMREAD_COLOR)
    memory_file.close()

    edges = get_edges(img)

    # getting filename to save image as
    img_filename = get_filename(10)
    full_img_path = os.path.join('static', 'coloring-pages', img_filename + '.jpg')
    while os.path.isfile(full_img_path):
        img_filename = get_filename(10)
        full_img_path = os.path.join('static', 'coloring-pages', img_filename + '.jpg')

    cv2.imwrite(full_img_path, edges)
    return redirect(url_for('edit', img=img_filename))


@app.route('/edit')
def edit():
    return render_template('edit.html')


if __name__ == '__main__':
    app.run()

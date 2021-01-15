from flask import Flask, render_template, redirect, url_for, request
import cv2
import string
import random
import os
import io
import numpy as np

app = Flask(__name__)


def get_filename(length):
    """
    Generates a random filename for a file
    :param length: Length of generated filename
    :return: string: filename without an extension
    """
    chars = string.ascii_letters
    filename = ''.join([random.choice(chars) for _ in range(length)])
    return filename


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/get-edges', methods=["POST"])
def get_edges():
    img_file = request.files['image']
    memory_file = io.BytesIO()
    img_file.save(memory_file)
    img_data = np.frombuffer(memory_file.getvalue(), dtype=np.uint8)
    img = cv2.imdecode(img_data, 1)
    memory_file.close()

    edges = cv2.Canny(img, 100, 200)

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

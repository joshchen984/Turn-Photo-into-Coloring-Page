"""
Deletes all images in coloring pages directory.
"""
import os
for f in os.listdir('static/coloring-pages'):
    os.remove(os.path.join('static/coloring-pages', f))

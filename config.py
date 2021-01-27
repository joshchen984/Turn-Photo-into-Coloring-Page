from dotenv import load_dotenv
from os import environ

load_dotenv('.env')


class Config:
    FLASK_ENV = 'development'
    DEBUG = True
    TESTING = True
    SECRET_KEY = environ.get('SECRET_KEY')


class ProdConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False
    TESTING = False

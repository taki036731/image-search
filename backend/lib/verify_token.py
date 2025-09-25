from flask import request, jsonify
from functools import wraps
from firebase_admin import auth

def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Authorization token is missing'}), 401

        try:
            token = token.split('Bearer ')[1]  # "Bearer <token>"
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)

    decorated_function.__name__ = f.__name__
    return decorated_function

import os
from flask import Flask, jsonify, send_from_directory, request
from dotenv import load_dotenv
import requests

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')

load_dotenv()

@app.route('/api/search', methods=['GET'])
def search_images():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is missing'}), 400
    
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        return jsonify({'error': 'Google API key is missing'}), 500
    cse_id = os.getenv('GOOGLE_CSE_ID')
    if not cse_id:
        return jsonify({'error': 'Google Custom Search Engine ID is missing'}), 500
    
    url = f'https://www.googleapis.com/customsearch/v1?key={api_key}&cx={cse_id}&q={query}&searchType=image&imgSize=Huge'

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        images = [item['link'] for item in data.get('items', [])]
        return jsonify({'images': images})
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', defaults={'url_path': ''})
@app.route('/<path:url_path>')
def serve(url_path):
    if url_path and os.path.exists(app.static_folder + '/' + url_path):
        return send_from_directory(app.static_folder, url_path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
#
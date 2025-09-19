import os
from flask import Flask, jsonify, send_from_directory, request
from dotenv import load_dotenv
import requests
import concurrent.futures

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

    def fetch_page(start_index):
        """指定された開始インデックスでAPIから画像を取得する"""
        try:
            url = f'https://www.googleapis.com/customsearch/v1?key={api_key}&cx={cse_id}&q={query}&searchType=image&imgSize=Huge&start={start_index}'
            response = requests.get(url, timeout=5)  # タイムアウトを設定
            response.raise_for_status()  # HTTPエラーがあれば例外を発生させる
            data = response.json()
            items = data.get('items', [])
            return [item['link'] for item in items] if items else []
        except requests.exceptions.RequestException as e:
            # 本番環境ではloggingモジュールを使うのが望ましい
            print(f"Error fetching page at start_index {start_index}: {e}")
            return []

    all_images = []
    num_pages = 3
    try:
        # ThreadPoolExecutorを使用して10回のリクエストを並列実行
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            start_indices = [i * 10 + 1 for i in range(num_pages)]
            # mapを使って各start_indexに対するfetch_pageを並列実行し、結果を待つ
            results = executor.map(fetch_page, start_indices)

            for image_list in results:
                all_images.extend(image_list)

        return jsonify({'images': all_images})
    except Exception as e:
        # より詳細なエラーハンドリングが望ましい
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500


@app.route('/', defaults={'url_path': ''})
@app.route('/<path:url_path>')
def serve(url_path):
    if url_path and os.path.exists(app.static_folder + '/' + url_path):
        return send_from_directory(app.static_folder, url_path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
#

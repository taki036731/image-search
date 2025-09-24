import os
from flask import Flask, jsonify, send_from_directory, request
from dotenv import load_dotenv
import requests
import concurrent.futures
import logging
from werkzeug.utils import safe_join
import math

# ロギングの設定: アプリケーションの動作状況やエラーを記録します
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')

load_dotenv()

# 設定値を定数として定義し、管理しやすくします
MAX_WORKERS = 10
REQUEST_TIMEOUT = 5
MAX_QUERY_LENGTH = 100


@app.route('/api/search', methods=['GET'])
def search_images():
    query = request.args.get('query')
    num_str = request.args.get('num', '10')

    if not query:
        return jsonify({'error': 'Query parameter is missing'}), 400

    if len(query) > MAX_QUERY_LENGTH:
        return jsonify({'error': f'Query parameter exceeds maximum length of {MAX_QUERY_LENGTH} characters'}), 400
    
    try:
        num_images = int(num_str)
        num_images = max(10, min(100, num_images)) # 10-100の範囲に収める
    except ValueError:
        return jsonify({'error': 'Invalid number of images specified'}), 400

    api_key = os.getenv('GOOGLE_API_KEY')
    cse_id = os.getenv('GOOGLE_CSE_ID')

    if not api_key or not cse_id:
        logging.error("Google API key or Custom Search Engine ID is missing.")
        return jsonify({'error': 'Google API key or Custom Search Engine ID is missing.'}), 500

    num_pages = math.ceil(num_images / 10)
    all_images = []
    try:
        # パフォーマンス向上のため、単一のSessionを共有してコネクションを再利用します
        with requests.Session() as session:
            def fetch_page(start_index):
                """指定された開始インデックスでAPIから画像を取得する（共有セッションを使用）"""
                try:
                    params = {
                        'key': api_key,
                        'cx': cse_id,
                        'q': query,
                        'searchType': 'image',
                        'imgSize': 'Huge',
                        'start': start_index
                    }
                    response = session.get('https://www.googleapis.com/customsearch/v1',
                                           params=params,
                                           timeout=REQUEST_TIMEOUT)
                    response.raise_for_status()
                    items = response.json().get('items', [])
                    return [item['link'] for item in items if 'link' in item]
                except requests.exceptions.RequestException as e:
                    logging.error(
                        f"Error fetching page at start_index {start_index}: {e}")
                    return []

            # ThreadPoolExecutorを使用してリクエストを並列実行
            with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                start_indices = [i * 10 + 1 for i in range(num_pages)]
                results = executor.map(fetch_page, start_indices)
                for image_list in results:
                    all_images.extend(image_list)

        all_images = all_images[:num_images] # 指定された数に切り詰める
        logging.info(f"Returning {len(all_images)} images for query '{query}'")
        return jsonify({'images': all_images})
    except Exception as e:
        # より詳細なエラーハンドリングが望ましい
        logging.error(f"Unexpected error occurred in search_images: {e}")
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500


@app.route('/', defaults={'url_path': ''})
@app.route('/<path:url_path>')
def serve(url_path):
    # 静的ファイルのパス結合
    if not url_path:
        return send_from_directory(app.static_folder, 'index.html')
    # セキュリティ: パストラバーサル攻撃を防ぐため、安全なパスを生成
    safe_path = safe_join(app.static_folder, url_path)
    # パスが不正、またはファイルでない場合はindex.htmlを返す
    if safe_path is None or not os.path.isfile(safe_path):
        return send_from_directory(app.static_folder, 'index.html')

    return send_from_directory(app.static_folder, url_path)


if __name__ == '__main__':
    # 環境変数 'FLASK_DEBUG' が '1' または 'true' (大文字小文字を問わない) の場合にデバッグモードを有効にします
    # 未設定の場合はデフォルトで False になります
    is_debug = os.getenv('FLASK_DEBUG', 'false').lower() in ('true', '1')
    app.run(debug=is_debug)
#

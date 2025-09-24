FROM mcr.microsoft.com/devcontainers/python:2.0-3.13-trixie

RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    shfmt

RUN npm install -g n && n latest

# 作業ディレクトリの設定
WORKDIR /workspaces/image-search

# バックエンドの依存関係をインストール
COPY ./backend/requirements.txt /tmp/pip-requirements.txt
RUN pip3 install --no-cache-dir -r /tmp/pip-requirements.txt

# ポート公開
EXPOSE 3000
EXPOSE 5000
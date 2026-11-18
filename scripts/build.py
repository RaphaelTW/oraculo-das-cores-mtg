#!/usr/bin/env python3
"""Netlify build: copy static quiz and generate absolute SEO URLs from SITE_URL or URL.

Works on Netlify build image without installing packages. Can also be run locally.
No domain placeholder is exposed to crawlers when no final URL is configured.
"""
import os
import re
import shutil
import sys
from html import escape
from pathlib import Path
from urllib.parse import urlparse
from xml.sax.saxutils import escape as xml_escape
from sync_data import sync

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'site'
DEST=ROOT/'dist'

def usable_url(value):
    value=(value or '').strip().rstrip('/')
    parsed=urlparse(value)
    if parsed.scheme != 'https' or not parsed.netloc or parsed.username or parsed.password or parsed.path not in ('','/'):
        return ''
    # avoid generating non-production canonical with ephemeral deploy URLs
    return value

def put_tag(html,tag):
    return html.replace('</head>',f'{tag}\n</head>',1)

def configure(folder,site_url):
    html_path=folder/'index.html'
    page=html_path.read_text(encoding='utf-8')
    # Prevent duplicated tags if invoked more than once on existing output
    page=re.sub(r'<link rel="canonical"[^>]+>\s*','',page)
    page=re.sub(r'<meta property="og:(?:url|image)"[^>]+>\s*','',page)
    page=re.sub(r'<meta name="twitter:image"[^>]+>\s*','',page)
    if site_url:
        url=site_url+'/'
        image=site_url+'/assets/img/compartilhamento.png'
        tags=(f'<link rel="canonical" href="{escape(url,quote=True)}">\n'
              f'<meta property="og:url" content="{escape(url,quote=True)}">\n'
              f'<meta property="og:image" content="{escape(image,quote=True)}">\n'
              f'<meta name="twitter:image" content="{escape(image,quote=True)}">')
        page=put_tag(page,tags)
        # Insert authoritative URL into structured data, currently one WebApplication object
        page=page.replace('"isAccessibleForFree":true}', '"isAccessibleForFree":true,"url":"'+url+'"}',1)
        (folder/'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>{xml_escape(url)}</loc></url>\n</urlset>\n',encoding='utf-8')
        (folder/'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {url}sitemap.xml\n',encoding='utf-8')
        print('SEO: canonical, Open Graph, robots.txt e sitemap.xml:',url)
    else:
        (folder/'sitemap.xml').unlink(missing_ok=True)
        print('SEO: URL nao informada; sem canonical/sitemap inventado. Defina SITE_URL para o dominio publico.')
    html_path.write_text(page,encoding='utf-8')

if __name__=='__main__':
    if not SRC.joinpath('index.html').exists():
        print('index.html ausente em site/',file=sys.stderr);sys.exit(1)
    if DEST.exists():shutil.rmtree(DEST)
    shutil.copytree(SRC,DEST)
    sync(DEST/"index.html")
    url=usable_url(os.environ.get('SITE_URL') or os.environ.get('URL'))
    configure(DEST,url)

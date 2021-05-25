from youtube_dl import YoutubeDL
import os
import time
import sys 
import json 

# config
HOME_DIR = os.path.dirname(os.path.realpath(__file__))
temp_folder = 'temp_files'
destination = 'converted'

output_obj = {}

# get link from sys arguments
if len(sys.argv) < 2:
    raise Exception('Link required!')
link = sys.argv[1]

# make temp dir for storing temp files
temp_path = os.path.join(HOME_DIR, temp_folder)
if not os.path.exists(temp_path):
    os.mkdir(temp_path)

# make dir for storing converted files, if not already present
destination_path = os.path.join(HOME_DIR, destination)
if not os.path.exists(destination_path):
    os.mkdir(destination_path)

# options dict for youtube_dl
yt_opt = {
    'format':'bestaudio',
    'outtmpl': '{}'.format(os.path.join(temp_path, '%(title)s.%(ext)s')),
    'quiet': True
}

# get files from link
try:
    audio_downloader = YoutubeDL(yt_opt)
    result = audio_downloader.extract_info(link)
    output_obj['title'] = result['title']
    output_obj['old_ext'] = result['ext']
except:
    undownloaded_links.append(link)
    raise Exception('Error in downloading the raw file!')

# convert these files to mp3
try:
    temp_file = '{}.{}'.format(output_obj['title'], output_obj['old_ext'])
    old_path = os.path.join(temp_path, temp_file)
    filename = output_obj['title'] + '.mp3'
    new_path = os.path.join(destination_path, filename)
    os.system('ffmpeg -i "{}" "{}" -y -loglevel quiet'.format(old_path, new_path))
    os.remove('{}'.format(old_path))
except:
    raise Exception('Error in conversion!')

# delete temp folder
# os.rmdir(temp_path)

# print the output object
print(json.dumps(output_obj, ensure_ascii=False))
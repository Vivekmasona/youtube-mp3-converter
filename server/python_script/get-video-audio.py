from youtube_dl import YoutubeDL
import os
import time
import sys 

# config
HOME_DIR = os.path.dirname(os.path.realpath(__file__))
temp_folder = 'temp_files'
destination = 'converted'
video_links_file = 'video_links.txt'

# get link from sys arguments
links_path = os.path.join(HOME_DIR, video_links_file)
f = open(links_path, 'r')
links = [g.rstrip() for g in f.readlines()]
undownloaded_links = []

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
    'outtmpl': '{}'.format(os.path.join(temp_path, '%(title)s.%(ext)s'))
}

# get files
for link in links:
    try:
        audio_downloader = YoutubeDL(yt_opt)
        result = audio_downloader.extract_info(link)
        print('\n{} downloaded!\n'.format(result['title']) )
    except:
        undownloaded_links.append(link)
        print('Error!')
    time.sleep(2)

# convert these files to mp3
for temp_file in os.listdir(temp_path):
    try:
        filename = ".".join(temp_file.split('.')[:-1]) + '.mp3'
        old_path = os.path.join(temp_path, temp_file)
        new_path = os.path.join(destination_path, filename)
        os.system('ffmpeg -i "{}" "{}" -y'.format(old_path, new_path))
        os.remove('{}'.format(old_path))
    except:
        print('Error in conversion!')

# delete temp folder
os.rmdir(temp_path)

# write all the undownloaded links in the file
with open(links_path, 'w') as f:
    f.write("\n".join(undownloaded_links))
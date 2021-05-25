from youtube_dl import YoutubeDL
import ffmpeg
import os
import time

# config
HOME_DIR = os.path.dirname(os.path.realpath(__file__))
temp_folder = 'temp_files'
destination = 'converted'
video_links_file = 'video_links.txt'

yt_opt = {
    'format':'bestaudio',
    'outtmpl': '{}/{}/%(title)s.%(ext)s'.format(HOME_DIR, temp_folder)
}

f = open(video_links_file, 'r')
links = [g.rstrip() for g in f.readlines()]
undownloaded_links = []

# make temp dir for storing temp files
temp_path = os.path.join(HOME_DIR, temp_folder)
os.mkdir(temp_path)

# make dir for storing converted files, if not already present
if not os.path.exists(os.path.join(HOME_DIR, destination)):
    os.mkdir(os.path.join(HOME_DIR, destination))

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
for temp_file in os.listdir(temp_folder):
    try:
        filename = ".".join(temp_file.split('.')[:-1]) + '.mp3'
        os.system('ffmpeg -i "{}/{}" "{}/{}" -y'.format(temp_folder, temp_file, destination, filename))
        os.remove('{}/{}'.format(temp_folder, temp_file))
    except:
        print('Error in conversion!')

# delete temp folder
os.rmdir(temp_path)

# write all the undownloaded links in the file
with open(video_links_file, 'w') as f:
    f.write("\n".join(undownloaded_links))
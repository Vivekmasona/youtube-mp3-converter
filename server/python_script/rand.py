import os
HOME_DIR = os.path.dirname(os.path.realpath(__file__))
print(os.path.join(HOME_DIR, 'temp_folder', 'temp_file'))
import os

# Directory containing the .txt files
directory = 'links2'

# List to store the merged content
merged_content = []

# Iterate through each file in the directory
for filename in os.listdir(directory):
    if filename.endswith('.txt'):
        file_path = os.path.join(directory, filename)
        with open(file_path, 'r') as file:
            # Read the content of the file
            content = file.read().splitlines()
            # Add unique lines to the merged_content list
            merged_content.extend(line for line in content if line not in merged_content)

# Write the merged content to a new file
with open('merged.txt', 'w') as file:
    file.write('\n'.join(merged_content))
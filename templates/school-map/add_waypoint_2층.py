import re

# Read the file
with open('templates/school-map/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find 2층 section and add waypoint
# We'll look for the 2층 floor-map section specifically
pattern = r'(<!-- 2층 -->.*?<div class="floor-map" data-floor="2">.*?<!-- 비상구4에서 오른쪽 복도로 연결 -->.*?<circle class="waypoint" cx="830" cy="300" r="4" fill="#e74c3c" stroke="white" stroke-width="1" opacity="1" data-waypoint="w79"/>)(.*?<circle class="waypoint" cx="830" cy="350")'

replacement = r'\1\n                        <circle class="waypoint" cx="830" cy="337" r="4" fill="#e74c3c" stroke="white" stroke-width="1" opacity="1" data-waypoint="w79a"/>\2<circle class="waypoint" cx="830" cy="350"'

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open('templates/school-map/index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('2층에 w79a 웨이포인트 추가 완료')

import re

# Read the file
with open('templates/school-map/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and remove w78-w81 waypoints only from 4층
in_4f_section = False
marker_found = False
lines_to_remove = []

for i, line in enumerate(lines):
    # Check if we're in the 4층 waypoints section
    if '4층에는 비상구4 없음' in line:
        in_4f_section = True
        marker_found = True
        continue

    # If we found the marker and are in the section, look for w78-w81
    if in_4f_section and marker_found:
        # Check for the comment line before waypoints
        if '비상구4에서 오른쪽 복도로 연결' in line:
            lines_to_remove.append(i)
            # Remove the next 4 lines (w78, w79, w80, w81) and blank line
            for j in range(1, 6):
                if i + j < len(lines):
                    lines_to_remove.append(i + j)
            break

# Remove lines in reverse order to maintain indices
for i in sorted(lines_to_remove, reverse=True):
    del lines[i]

# Write back
with open('templates/school-map/index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f'Removed {len(lines_to_remove)} lines from 4th floor')

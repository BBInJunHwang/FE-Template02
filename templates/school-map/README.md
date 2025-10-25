# 학교 지도 길찾기 시스템 가이드

## 목차
1. [개요](#개요)
2. [좌표 시스템](#좌표-시스템)
3. [Waypoint (경유점) 시스템](#waypoint-경유점-시스템)
4. [길찾기 알고리즘 (A*)](#길찾기-알고리즘-a)
5. [건물 배치 시스템](#건물-배치-시스템)
6. [층별 네비게이션](#층별-네비게이션)
7. [비상구 시스템](#비상구-시스템)

---

## 개요

이 프로젝트는 학교 건물의 4개 층을 대화형 지도로 보여주고, 출발지에서 목적지까지의 최적 경로를 찾아주는 웹 애플리케이션입니다.

**주요 기능:**
- 4개 층 간 이동 경로 안내
- A* 알고리즘을 이용한 최단 경로 계산
- 비상구까지의 경로 안내
- 실시간 경로 애니메이션

---

## 좌표 시스템

### SVG 기반 좌표계

이 프로젝트는 **SVG (Scalable Vector Graphics)**를 사용하여 지도를 그립니다. SVG는 벡터 기반 그래픽이므로 확대/축소해도 선명합니다.

```javascript
// 좌표 예시
const waypoints = {
    'w1': { x: 170, y: 240 },  // 왼쪽 상단
    'w12': { x: 170, y: 569 }   // 왼쪽 하단
};
```

### 좌표 시스템 이해하기

```
(0,0) ──────────► X축
  │
  │
  │
  ▼
 Y축
```

- **X 좌표**: 왼쪽에서 오른쪽으로 증가 (0 → 1000+)
- **Y 좌표**: 위에서 아래로 증가 (0 → 800+)
- **원점 (0,0)**: SVG 캔버스의 왼쪽 상단

### 실제 적용 예시

```html
<!-- 빨간 점(waypoint)을 (170, 240) 위치에 그리기 -->
<circle class="waypoint"
        cx="170" cy="240" r="4"
        fill="#e74c3c"
        data-waypoint="w1"/>
```

---

## Waypoint (경유점) 시스템

### Waypoint란?

**Waypoint**는 복도나 통로의 중요한 지점을 표시하는 점입니다. 길찾기 알고리즘은 이 점들을 연결하여 경로를 만듭니다.

### Waypoint 배치 전략

```
복도 구조:
┌─────────┐
│  방1    │
├─────────┤ ← 복도
│  w1●    │   (waypoint 배치)
├─────────┤
│  방2    │
└─────────┘
```

### 코드 예시

```javascript
// 4층의 왼쪽 복도 waypoint들
const waypoints = {
    // 왼쪽 복도 (x=170으로 고정, y만 변경)
    'w1': { x: 170, y: 240 },
    'w2': { x: 170, y: 269 },
    'w3': { x: 170, y: 299 },
    'w4': { x: 170, y: 329 },
    // ... 계속
};
```

### Waypoint 배치 규칙

1. **복도에만 배치**: 방 내부에는 배치하지 않습니다
2. **일정한 간격**: 약 20~30픽셀 간격으로 배치
3. **교차점에 집중**: 복도가 만나는 곳에 더 많이 배치
4. **방과 연결**: 각 방 입구 근처에 waypoint 배치

### 방과 Waypoint 매핑

```javascript
// 각 방과 가장 가까운 waypoint 연결
const roomToWaypoint = {
    '4-1': 'w1',    // 4층 1번 방 → w1 waypoint
    '4-2': 'w2',    // 4층 2번 방 → w2 waypoint
    '4-3': 'w4',    // 4층 3번 방 → w4 waypoint
    // ...
};
```

---

## 길찾기 알고리즘 (A*)

### A* 알고리즘이란?

**A\* (A-star)**는 최단 경로를 찾는 가장 효율적인 알고리즘 중 하나입니다.

### 알고리즘 동작 원리

```
출발점(S) ─→ 목적지(G)

단계 1: 현재 위치에서 이동 가능한 모든 waypoint 찾기
단계 2: 각 waypoint의 "점수" 계산
        점수 = 현재까지 온 거리 + 목적지까지 예상 거리
단계 3: 점수가 가장 낮은 waypoint로 이동
단계 4: 목적지에 도착할 때까지 반복
```

### 핵심 공식

```javascript
f(n) = g(n) + h(n)
```

- **f(n)**: 총 점수 (이 값이 낮을수록 좋은 경로)
- **g(n)**: 출발점에서 현재 점까지의 실제 거리
- **h(n)**: 현재 점에서 목적지까지의 예상 거리 (휴리스틱)

### 거리 계산 (피타고라스 정리)

```javascript
// 두 점 사이의 직선 거리 계산
function getDistance(wp1, wp2) {
    const dx = waypoints[wp1].x - waypoints[wp2].x;
    const dy = waypoints[wp1].y - waypoints[wp2].y;
    return Math.sqrt(dx * dx + dy * dy);
}
```

```
거리 = √[(x2-x1)² + (y2-y1)²]

예시:
점A (170, 240)
점B (230, 570)

거리 = √[(230-170)² + (570-240)²]
     = √[60² + 330²]
     = √[3600 + 108900]
     = √112500
     ≈ 335.4
```

### A* 알고리즘 구현

```javascript
function findPath(startWaypoint, endWaypoint) {
    // 1. 초기화
    const openSet = [startWaypoint];      // 확인할 점들
    const closedSet = new Set();          // 이미 확인한 점들
    const cameFrom = {};                  // 경로 추적용
    const gScore = {};                    // 출발점부터의 거리
    const fScore = {};                    // 총 점수

    // 모든 waypoint의 초기 점수를 무한대로 설정
    Object.keys(waypoints).forEach(wp => {
        gScore[wp] = Infinity;
        fScore[wp] = Infinity;
    });

    // 출발점의 점수 설정
    gScore[startWaypoint] = 0;
    fScore[startWaypoint] = heuristic(startWaypoint, endWaypoint);

    // 2. 경로 찾기 반복
    while (openSet.length > 0) {
        // fScore가 가장 낮은 waypoint 선택
        let current = openSet[0];
        let lowestF = fScore[current];

        for (let i = 1; i < openSet.length; i++) {
            if (fScore[openSet[i]] < lowestF) {
                current = openSet[i];
                lowestF = fScore[current];
            }
        }

        // 목적지 도착!
        if (current === endWaypoint) {
            return reconstructPath(cameFrom, current);
        }

        // 현재 waypoint를 처리 완료로 표시
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.add(current);

        // 3. 인접한 waypoint 확인
        const neighbors = getNearestNeighbors(current, 10);

        neighbors.forEach(neighbor => {
            if (closedSet.has(neighbor)) return;

            const tentativeGScore = gScore[current] +
                                   getDistance(current, neighbor);

            // 더 좋은 경로를 찾았다면 업데이트
            if (tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = gScore[neighbor] +
                                  heuristic(neighbor, endWaypoint);

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        });
    }

    return []; // 경로를 찾지 못함
}
```

### 휴리스틱 함수

```javascript
// 목적지까지의 예상 거리 (직선 거리)
function heuristic(wp1, wp2) {
    return getDistance(wp1, wp2);
}
```

---

## 건물 배치 시스템

### 충돌 감지 (Collision Detection)

벽을 관통하지 않도록 경로가 방을 지나가는지 확인합니다.

```javascript
// 경로가 방을 관통하는지 확인
function pathCrossesRoom(wp1, wp2) {
    const x1 = waypoints[wp1].x;
    const y1 = waypoints[wp1].y;
    const x2 = waypoints[wp2].x;
    const y2 = waypoints[wp2].y;

    // 모든 방을 순회하며 교차 여부 확인
    for (const room of rooms) {
        if (lineIntersectsRect(x1, y1, x2, y2, room)) {
            return true;  // 방을 관통함!
        }
    }

    return false;  // 안전한 경로
}
```

### 동적 인접 노드 찾기

```javascript
// 현재 waypoint에서 갈 수 있는 가장 가까운 K개의 waypoint 찾기
function getNearestNeighbors(currentWp, k = 10) {
    const neighbors = [];
    const allWaypoints = Object.keys(waypoints);

    for (const wp of allWaypoints) {
        if (wp !== currentWp) {
            // 방을 관통하는 경로는 제외
            if (!pathCrossesRoom(currentWp, wp)) {
                const dist = getDistance(currentWp, wp);
                neighbors.push({ id: wp, distance: dist });
            }
        }
    }

    // 거리순으로 정렬하고 가장 가까운 k개 반환
    neighbors.sort((a, b) => a.distance - b.distance);
    return neighbors.slice(0, k).map(n => n.id);
}
```

### 선분 교차 알고리즘

```javascript
// 두 선분이 교차하는지 확인
function lineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denominator = ((x2 - x1) * (y4 - y3)) -
                       ((y2 - y1) * (x4 - x3));

    if (denominator === 0) return false;  // 평행

    const ua = (((x4 - x3) * (y1 - y3)) -
                ((y4 - y3) * (x1 - x3))) / denominator;
    const ub = (((x2 - x1) * (y1 - y3)) -
                ((y2 - y1) * (x1 - x3))) / denominator;

    return (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1);
}
```

---

## 층별 네비게이션

### 층 구조

```
4층 ┌─────────┐
    │ 교실들  │
    │         │
3층 ├─────────┤
    │ 교실들  │
    │         │
2층 ├─────────┤
    │ 교실들  │
    │         │
1층 └─────────┘
```

### 같은 층 내 경로 찾기

```javascript
function findPathSameFloor(start, end, floor) {
    const startWp = roomToWaypoint[start];
    const endWp = roomToWaypoint[end];

    // A* 알고리즘으로 경로 찾기
    const waypointPath = findPath(startWp, endWp);

    return waypointPath;
}
```

### 다른 층 간 경로 찾기

```javascript
function findPathDifferentFloor(start, end, startFloor, endFloor) {
    // 1. 출발 방 → 비상구(계단)
    const exit = findNearestEmergencyExit(start, startFloor, endFloor);

    // 2. 비상구 → 목적지 방
    const path1 = findPathSameFloor(start, exit, startFloor);
    const path2 = findPathSameFloor(exit, end, endFloor);

    return {
        floor1: startFloor,
        path1: path1,
        transferPoint: exit,
        floor2: endFloor,
        path2: path2
    };
}
```

### 층 전환 프로세스

```
출발지 (3층)
    ↓
복도 이동
    ↓
비상구/계단
    ↓
[층 전환]
    ↓
비상구/계단 (1층)
    ↓
복도 이동
    ↓
목적지 (1층)
```

---

## 비상구 시스템

### 비상구 위치

```javascript
const emergencyExits = {
    '비상구1': { x: 170, y: 240, waypoint: 'w1' },   // 왼쪽 상단
    '비상구2': { x: 395, y: 485, waypoint: 'w32' },  // 중앙
    '비상구3': { x: 847, y: 735, waypoint: 'w76' },  // 오른쪽 하단
    '비상구4': { x: 830, y: 250, waypoint: 'w78' },  // 오른쪽 상단
    '비상구5': { x: 720, y: 707, waypoint: 'w51a' }  // 하단 중앙 (1층만)
};
```

### 층별 비상구 가용성

```javascript
const emergencyExitAvailability = {
    '비상구1': [1, 2, 3, 4],  // 모든 층에서 사용 가능
    '비상구2': [1, 2, 3, 4],  // 모든 층에서 사용 가능
    '비상구3': [1, 2, 3, 4],  // 모든 층에서 사용 가능
    '비상구4': [1, 2, 3],     // 1~3층만 (4층 없음)
    '비상구5': [1]            // 1층만 (층간 이동 불가)
};
```

### 가장 가까운 비상구 찾기

```javascript
function findNearestEmergencyExit(roomName, startFloor, endFloor = null) {
    // 1. 방의 중심 좌표 구하기
    const roomElement = document.querySelector(
        `.room-group[data-room="${roomName}"] .room-shape`
    );
    const rect = roomElement.getBBox();
    const roomX = rect.x + rect.width / 2;
    const roomY = rect.y + rect.height / 2;

    // 2. 각 비상구까지의 거리 계산
    let nearestExit = null;
    let minDistance = Infinity;

    for (const [exitName, exitPos] of Object.entries(emergencyExits)) {
        // 층별 가용성 체크
        const exitFloors = emergencyExitAvailability[exitName] || [];

        // 층간 이동 시: 출발층과 도착층 모두에 존재해야 함
        if (endFloor !== null) {
            if (!exitFloors.includes(startFloor) ||
                !exitFloors.includes(endFloor)) {
                continue;
            }
        } else {
            // 같은 층 내: 현재 층에만 존재하면 됨
            if (!exitFloors.includes(startFloor)) {
                continue;
            }
        }

        // 유클리드 거리 계산
        const distance = Math.sqrt(
            Math.pow(roomX - exitPos.x, 2) +
            Math.pow(roomY - exitPos.y, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearestExit = exitName;
        }
    }

    return nearestExit;
}
```

---

## 경로 시각화

### 경로 그리기

```javascript
function drawPath(waypointPath) {
    if (waypointPath.length < 2) return;

    // SVG polyline으로 경로 그리기
    const points = waypointPath.map(wpId => {
        const wp = waypoints[wpId];
        return `${wp.x},${wp.y}`;
    }).join(' ');

    const polyline = document.createElementNS(
        'http://www.w3.org/2000/svg', 'polyline'
    );

    polyline.setAttribute('points', points);
    polyline.setAttribute('stroke', '#2ecc71');
    polyline.setAttribute('stroke-width', '3');
    polyline.setAttribute('fill', 'none');

    pathLayer.appendChild(polyline);
}
```

### 애니메이션 효과

```css
/* 경로 애니메이션 */
@keyframes dash {
    to {
        stroke-dashoffset: 0;
    }
}

.path-line {
    stroke-dasharray: 10;
    stroke-dashoffset: 1000;
    animation: dash 2s linear forwards;
}
```

---

## 시작하기

### 기본 사용법

1. **층 선택**: 상단의 층 버튼(1층, 2층, 3층, 4층) 클릭
2. **출발지 선택**: 지도에서 출발 교실 클릭
3. **도착지 선택**: 지도에서 목적지 교실 클릭
4. **경로 확인**: 초록색 선으로 표시된 경로를 따라가세요!

### 파일 구조

```
school-map/
├── index.html          # 메인 HTML 파일 (모든 코드 포함)
├── README.md          # 이 문서
└── images/            # 각 층의 평면도 이미지
```

---

## 핵심 개념 요약

### 1. 좌표 시스템
- SVG 기반 2D 좌표계
- (x, y) 형식으로 모든 위치 표현

### 2. Waypoint
- 복도와 통로의 중요 지점
- 경로 찾기의 기본 단위

### 3. A* 알고리즘
- f(n) = g(n) + h(n)
- 실제 거리 + 예상 거리로 최적 경로 계산

### 4. 충돌 감지
- 벽을 관통하지 않도록 경로 검증
- 동적으로 인접 노드 찾기

### 5. 층별 네비게이션
- 비상구를 통한 층간 이동
- 층별 독립적인 경로 계산

---

## 추가 학습 자료

### 알고리즘
- [A* 알고리즘 상세 설명](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [다익스트라 알고리즘](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

### 그래픽
- [SVG 튜토리얼](https://developer.mozilla.org/ko/docs/Web/SVG/Tutorial)
- [좌표계 이해하기](https://www.w3schools.com/graphics/svg_intro.asp)

### 수학
- [피타고라스 정리](https://ko.wikipedia.org/wiki/%ED%94%BC%ED%83%80%EA%B3%A0%EB%9D%BC%EC%8A%A4_%EC%A0%95%EB%A6%AC)
- [유클리드 거리](https://ko.wikipedia.org/wiki/%EC%9C%A0%ED%81%B4%EB%A6%AC%EB%93%9C_%EA%B1%B0%EB%A6%AC)

---

## 문의 및 개선

이 프로젝트에 대한 질문이나 개선 제안이 있으시면 언제든지 연락주세요!

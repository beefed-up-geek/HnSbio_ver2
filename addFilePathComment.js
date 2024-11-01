//하위 디렉터리의 모든 js파일에 맨 위에 디렉터리를 추가하는 코드
//node addFilePathComment.js 로 실행
const fs = require('fs');
const path = require('path');

// 프로젝트의 루트 디렉토리를 설정합니다.
const directoryPath = path.join(__dirname, 'src'); // src 대신 프로젝트 폴더 경로 지정

// 주석 추가 함수
function addCommentToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(__dirname, filePath);
  const comment = `// ${relativePath}\n`;

  // 파일에 이미 경로 주석이 있다면 추가하지 않음
  if (!content.startsWith(comment)) {
    fs.writeFileSync(filePath, comment + content);
    console.log(`Added comment to: ${relativePath}`);
  }
}

// 디렉토리 순회하며 .js 파일에 주석 추가
function processDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath); // 하위 디렉토리 탐색
    } else if (file.endsWith('.js')) {
      addCommentToFile(fullPath);
    }
  });
}

processDirectory(directoryPath);

const fs = require('fs');
const path = require('path');

// 프로젝트의 루트 디렉토리를 설정합니다.
const directoryPath = path.join(__dirname, 'src'); // src 대신 프로젝트 폴더 경로 지정

// 파일의 주석 제거 및 주석 추가 함수
function updateCommentInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(__dirname, filePath);
  const comment = `// ${relativePath}\n`;

  // 파일 시작 부분의 기존 주석 제거
  const commentRegex = /^(\/\/.*\n)+/;
  content = content.replace(commentRegex, '');

  // 경로 주석 추가
  fs.writeFileSync(filePath, comment + content);
  console.log(`Updated comment in: ${relativePath}`);
}

// 디렉토리 순회하며 .js 파일에 주석 업데이트
function processDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath); // 하위 디렉토리 탐색
    } else if (file.endsWith('.js')) {
      updateCommentInFile(fullPath);
    }
  });
}

processDirectory(directoryPath);

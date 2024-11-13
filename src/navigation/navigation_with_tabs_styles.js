// src\navigation\navigation_with_tabs_styles.js
const fs = require('fs');
const path = require('path');

// 프로젝트의 루트 디렉토리를 설정합니다.
const directoryPath = path.join(__dirname, 'src'); // src 대신 프로젝트 폴더 경로 지정

// 파일의 시작 부분 주석 제거 함수
function removeInitialComments(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(__dirname, filePath);

  // import/require 문을 찾습니다
  const importMatch = content.match(/^(?!.*\/\/.*)(?!.*\/\*.*)(import|const.*require|let.*require|var.*require)/m);
  
  if (importMatch) {
    // import/require 문의 위치를 찾습니다
    const importIndex = importMatch.index;
    
    // import 이전의 내용을 제거하고 import부터 시작하도록 합니다
    content = content.slice(importIndex);
  } else {
    // import가 없는 경우 파일 시작의 모든 주석을 제거
    content = content.replace(/^(\s*\/\/.*\n|\s*\/\*[\s\S]*?\*\/\s*|\s*\n)*/g, '');
  }

  // 파일 시작 부분의 빈 줄 제거
  content = content.replace(/^\s*\n/, '');

  fs.writeFileSync(filePath, content);
  console.log(`Removed initial comments from: ${relativePath}`);
}

// 디렉토리 순회하며 .js 파일의 주석 제거
function processDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath); // 하위 디렉토리 탐색
    } else if (file.endsWith('.js')) {
      removeInitialComments(fullPath);
    }
  });
}

processDirectory(directoryPath);
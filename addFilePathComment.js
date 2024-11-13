const fs = require('fs');
const path = require('path');

// 프로젝트의 루트 디렉토리를 설정합니다.
const directoryPath = path.join(__dirname, 'src'); // src 대신 프로젝트 폴더 경로 지정

// 파일의 시작 부분 주석 제거 함수
function removeInitialComments(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(__dirname, filePath);

  // 파일 내용을 줄 단위로 분리
  let lines = content.split('\n');

  // 실제 코드(import 또는 require)가 시작되는 줄 찾기
  const codeStartIndex = lines.findIndex(line => {
    // 빈 줄이나 주석이 아닌 import/require로 시작하는 줄 찾기
    const trimmedLine = line.trim();
    return (trimmedLine.startsWith('import') || trimmedLine.includes('require')) &&
           !trimmedLine.startsWith('//') &&
           !trimmedLine.startsWith('/*');
  });

  if (codeStartIndex !== -1) {
    // import/require부터 시작하도록 이전 내용 모두 제거
    lines = lines.slice(codeStartIndex);
    content = lines.join('\n');
  } else {
    // import/require가 없는 경우 모든 시작 주석 제거
    content = content.replace(/^(\s*\/\/.*\n|\s*\/\*[\s\S]*?\*\/\s*|\s*\n)*/g, '');
  }

  fs.writeFileSync(filePath, content);
  console.log(`Removed initial comments from: ${relativePath}`);
}

// 파일 경로 주석 추가 함수
function addPathComment(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(__dirname, filePath);
  const pathComment = `// ${relativePath}\n`;
  
  fs.writeFileSync(filePath, pathComment + content);
  console.log(`Added path comment to: ${relativePath}`);
}

// 디렉토리 순회하며 주석 제거
function processDirectoryRemoveComments(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectoryRemoveComments(fullPath);
    } else if (file.endsWith('.js')) {
      removeInitialComments(fullPath);
    }
  });
}

// 디렉토리 순회하며 경로 주석 추가
function processDirectoryAddPathComments(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectoryAddPathComments(fullPath);
    } else if (file.endsWith('.js')) {
      addPathComment(fullPath);
    }
  });
}

// 메인 실행
console.log('Removing initial comments...');
processDirectoryRemoveComments(directoryPath);

console.log('\nAdding path comments...');
processDirectoryAddPathComments(directoryPath);

console.log('\nAll done!');
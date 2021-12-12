// module
const fs = require("fs");
const path = require("path");
const picturePath = "/Users/yoxxin/Pictures"; // 사진 폴더
const folderName = process.argv[2]; // 세번째 인자, 사진이 들어있는 폴더명, 월별로 정리 (Jan, Feb...)
const folderPath = path.join(picturePath, folderName); // 작업할 최종 폴더
const fileExtensions = {
  // 파일 확장자 선언
  video: new Set([".mp4", ".mov"]),
  captured: new Set([".png", ".aae"]),
};

// createFolder: video, captured, duplicated 폴더 만들기
function createFolder() {
  let names = ["video", "captured", "duplicated"];
  for (name of names) {
    let targetPath = attachPath(folderPath, name);
    fs.mkdir(targetPath, () => {});
  }
}

/*  classifyPictures: 사진 분류하기
video: .mp4 .mov 같은 비디오 확장자
captured: .png(스크린샷) .aae (아이폰 사진편집하면 생김)파일 보관
duplicated: 수정한 파일이 있을때 원본 파일을 복사하여 보관 (IMG_E 로 시작)
*/
function classifyPictures() {
  let files = getFileNames(folderPath);
  moveVideoFiles(files);
  moveCapturedFiles(files);
  moveDuplicated(files);
}

// getFileNames()
// 작업할 폴더에 있는 파일 목록 반환
function getFileNames(folderPath) {
  return fs.readdirSync(folderPath);
}

// getFileExtension(file)
// 파일확장자 return
function getFileExtension(file) {
  return path.extname(file);
}
// attachPath(dir, fileName)
// 폴더 경로와 파일이름 합쳐준다
function attachPath(dir, fileName) {
  return path.join(dir, fileName);
}
// moveFile(folderPath,nextPath,fileName)
// 원래 위치에서 옮길 위치로 파일을 옮긴다
function moveFile(folderPath, nextPath, file) {
  return fs.rename(
    attachPath(folderPath, file),
    attachPath(nextPath, file),
    (err) => {
      if (err) {
        console.error(err);
      } else console.log(`move ${file} to ${path.basename(nextPath)}`); // 파일 이동 시 로그 출력
    }
  );
}
// moveVideoFiles(files)
// files배열안의 각 file들을 골라 video폴더로 이동
function moveVideoFiles(files) {
  let nextPath = attachPath(folderPath, "video"); // video 폴더 경로
  files
    .filter((file) => fileExtensions["video"].has(getFileExtension(file)))
    .forEach((file) => moveFile(folderPath, nextPath, file));
}
// moveCaptured(files)
function moveCapturedFiles(files) {
  let nextPath = attachPath(folderPath, "captured"); // captured 폴더 경로
  files
    .filter((file) => fileExtensions["captured"].has(getFileExtension(file)))
    .forEach((file) => moveFile(folderPath, nextPath, file));
}
// moveDuplicated(files)
// IMG_E0000 파일 고르기(1) -> 원본 파일인 IMG_0000(2)이 있으면(3) 원본 파일을 duplicated 폴더로 옮기기 (4)
function moveDuplicated(files) {
  let nextPath = attachPath(folderPath, "duplicated"); // duplicated 폴더 경로
  files
    .filter((file) => file.includes("IMG_E")) // 1
    .map((file) => file.replace("E", "")) // 2
    .filter((file) => files.includes(file)) // 3
    .forEach((file) => moveFile(folderPath, nextPath, file)); // 4
}
// main
createFolder();
classifyPictures();
console.log(1);

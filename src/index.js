const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Raspicam = require('raspicam');
const exec = require('child_process').exec;
const id = require('machine-uuid');
const mic = require('mic');
const getDuration = require('get-video-duration');

/*
	1. 앱 시작
	2. faceCam on
	3. streaming file 생성
	4. face api detect 호출
	5. response(face id)로 face api identity 호출
	6. response(confidence) 0.8 이상이면 얼굴 일치 true
	7. 얼굴 일치 true면 videoCam(녹화) start && TTS(Text To Speech) "얼굴 확인되었습니다. 녹화를 시작합니다"
	8. child_process로 바코드 인식
	9. 바코드 우리 서버로 api 호출
	10. 기존 환자에게 처방된 약 or 주사인지 비교. true면 db에 기록
	11. 30분(시연 용은 30초) 후에 videoCam(녹화) 종료
	12. 서버로 video file 전송
	13. faceCam 재실행
*/


const INFINITY_MS = 999999999;

const faceCam = new Raspicam({
			mode: "timelapse",
			output: "../stream/image_stream.jpg",
			encoding: "jpg",
			timeout: INFINITY_MS,
			timelapse: 2
});

// 비디오 라즈피캠
const videoCam = new Raspicam({
			// mode: "video",
			// output: "../stream/image_stream.jpg",
			// encoding: "jpg",
			// timeout: INFINITY_MS,
			// timelapse: 2
		});
// var MRS = MRS || {};

// MRS.prototype.startFaceStreaming = function() {
// 	faceCam.start();
// 	fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
// 		console.log(current);
// 		console.log(previous);
// 	});
// }

function startFaceStreaming() {
	faceCam.start();
	fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
		console.log(current);
		console.log(previous);
	});
}
faceCam.on("read", function(err, timestamp, filename) {
	console.log(filename);
});


function startVideoRecord() {
	videoCam.start();
}

faceCam.on('start', function(err, timestamp) {
			console.log(`timestamp started at : ${timestamp}`);
});

startFaceStreaming();
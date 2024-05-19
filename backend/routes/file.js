const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { MetaTransferService, DataTransferService } = require("../services/filetransferservice");
const { PatientService } = require("../services/patientservice");
const { FileService } = require("../services/fileservice");
const { ServiceAttrService } = require("../services/serviceattrservice");
const { Literals } = require("../literal/literals");

// Multer 객체 생성 및 파일 업로드 미들웨어 설정 (TEST 용도입니다)
const upload = MetaTransferService.initMulter();
const uploadMiddleware = upload.single("filekey"); // filekey는 클라이언트에서 전송한 파일의 키 값, single()은 하나의 파일만 업로드할 때 사용 (array()는 여러 파일 업로드)

// test 용도의 업로드 API
router.post("/upload/data", uploadMiddleware, (req, res) => {
    console.log(req.file);
    res.json({ header: req.file });
});

// ZIP 파일 생성 및 다운로드, 
router.post("/download", async (req, res) => {
    await DataTransferService.downloadZip(req.body)
        .then(() => {
            res.status(200).send(Literals.FTP.ZIP_SUCCESS);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

// SSE 엔드포인트 연결 설정, 다운로드 진행도(%) 확인
router.get("/download/progress", (req, res) => {
    DataTransferService.getDownloadProgress(req, res)
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

// 중복 필터 검색 용 API(기본형, 병원 추가예정)
router.post("/search", async (req, res) => {
    // FileService.getNthPageByQuery(serviceAttrs, query, page, limit) 사용 시 페이징 처리
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10; // 기본으로 출력하는 개수

    await FileService.getAllMetaDataByQuery(await ServiceAttrService.getServiceByName(req.body.name), req.body.attributes)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

// 환자 메타데이터 추가 API
router.post("/patients", async (req, res) => {
    await PatientService.addPatients(req.body)
        .then(() => {
            res.status(200).send(Literals.FILE.ADD_PATIENT_SUCCESS);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

// 파일 메타데이터 추가 API
router.post("/", async (req, res) => {
    await FileService.addFiles(req.body)
        .then(() => {
            res.status(200).send(Literals.FILE.ADD_FILE_SUCCESS);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

module.exports = router;
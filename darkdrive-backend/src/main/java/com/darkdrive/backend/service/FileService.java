package com.darkdrive.backend.service;

import com.darkdrive.backend.dto.FileUploadResponse;
import com.darkdrive.backend.model.FileEntity;
import com.darkdrive.backend.model.User;
import com.darkdrive.backend.repository.FileRepository;
import com.darkdrive.backend.repository.UserRepository;
import com.darkdrive.backend.util.CryptoUtil;

// import org.apache.tomcat.util.http.fileupload.FileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {
    @Autowired
    private S3Client s3Client;

    @Autowired
    FileRepository fileRepository;

    @Autowired
    UserRepository userRepository;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public FileUploadResponse uploadFile(MultipartFile file, String password) throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Boolean locked = false;

        byte[] fileBytes = file.getBytes();
        byte[] bytesToStore = fileBytes;

        if (!password.isEmpty()) {
            bytesToStore = CryptoUtil.encrypt(fileBytes, password);
            locked = true;
        }

        String s3Key = user.getUsername() + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // Upload file to S3
        try {
            s3Client.putObject(PutObjectRequest.builder().bucket(bucketName).key(s3Key).build(),
                    RequestBody.fromBytes(bytesToStore));
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to S3: " + e.getMessage());
        }

        // save meta data
        FileEntity fileEntity = new FileEntity();
        fileEntity.setUser(user);
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setLocked(locked);
        fileEntity.setS3Key(s3Key);
        fileRepository.save(fileEntity);

        System.out.println("Meta data: " + fileEntity);

        FileUploadResponse fileUploadResponse = new FileUploadResponse();
        fileUploadResponse.setId(fileEntity.getId());
        fileUploadResponse.setFileName(fileEntity.getFileName());
        fileUploadResponse.setLocked(fileEntity.getLocked());
        fileUploadResponse.setUploadDate(fileEntity.getUploadDate());

        return fileUploadResponse;

    }

    public List<FileUploadResponse> listFiles() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        List<FileEntity> files = fileRepository.findByUser(user);

        return files.stream().map(file -> {
            FileUploadResponse response = new FileUploadResponse();
            response.setFileName(file.getFileName());
            response.setId(file.getId());
            response.setLocked(file.getLocked());
            response.setUploadDate(file.getUploadDate());
            return response;
        }).collect(Collectors.toList());
    }

    public byte[] downloadFile(Long fileId, String password, boolean locked) throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        FileEntity file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));

        if (!file.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to download this file");
        }

        GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucketName).key(file.getS3Key()).build();

        byte[] bytesToReturn = s3Client.getObjectAsBytes(getObjectRequest).asByteArray();
        if (locked) {

            bytesToReturn = CryptoUtil.decrypt(bytesToReturn, password);
        }

        return bytesToReturn;
    }

    public void deleteFile(FileEntity fileToDelete) throws Exception {
        s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucketName).key(fileToDelete.getS3Key()).build());
    }
}

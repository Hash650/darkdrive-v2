package com.darkdrive.backend.controller;

import com.darkdrive.backend.dto.FileUploadResponse;
import com.darkdrive.backend.model.FileEntity;
import com.darkdrive.backend.service.FileService;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.darkdrive.backend.repository.FileRepository;

import java.util.List;

import javax.crypto.AEADBadTagException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private FileRepository fileRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("password") String password) throws Exception {

        try{

            FileUploadResponse uploadedFile = fileService.uploadFile(file, password);
            return ResponseEntity.ok(uploadedFile);
        }
        catch(Exception e)
        {
            return ResponseEntity.status(400).body("Upload failed "+ e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<FileUploadResponse>> listFiles() {
        List<FileUploadResponse> files = fileService.listFiles();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<?> downloadFile(
        @PathVariable Long fileId,
        @RequestParam("password") String password,
        @RequestParam("locked") Boolean locked
    ) throws Exception
    {

        try{

            byte[] fileBytes = fileService.downloadFile(fileId, password, locked);
            FileEntity file = fileRepository.findById(fileId).orElseThrow();
            return ResponseEntity.ok().header("Content-Disposition", "attachment; filename=\"" + file.getFileName() + "\"").body(fileBytes);
        }
        catch(AEADBadTagException e)
        {
            System.out.println("DOWNLOAD ERROR CATCHING EXCEPTION");
            return ResponseEntity.badRequest().body("Invalid password: Decryption failed");
        }

    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<String> deleteFile (
        @PathVariable Long fileId
    )
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        FileEntity fileMeta = fileRepository.findById(fileId).orElseThrow(() -> new  ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));

        if(!fileMeta.getUser().getEmail().equals(email)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to delete this file");
        }

        try{

            fileService.deleteFile(fileMeta);
            
            fileRepository.delete(fileMeta);
            
            return ResponseEntity.ok("File deleted successfully");
        }
        catch (Exception e )
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Error occurred when deleting file");
        }

    }

}

package com.darkdrive.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FileUploadResponse {
    private Long id;
    private String fileName;
    private LocalDateTime uploadDate;
    private Boolean locked;
}

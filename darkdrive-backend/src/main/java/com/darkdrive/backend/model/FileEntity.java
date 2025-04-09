package com.darkdrive.backend.model;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;




@Entity
@Table(name = "files")
@Data
public class FileEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name="locked", nullable = false)
    private Boolean locked;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "s3_key", nullable = false)
    private String s3Key;

    @Column(name ="upload_date", nullable = false)
    private LocalDateTime uploadDate = LocalDateTime.now();
}

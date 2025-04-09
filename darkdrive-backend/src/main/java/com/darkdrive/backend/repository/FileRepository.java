package com.darkdrive.backend.repository;

import com.darkdrive.backend.model.FileEntity;
import com.darkdrive.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByUser(User user);
}
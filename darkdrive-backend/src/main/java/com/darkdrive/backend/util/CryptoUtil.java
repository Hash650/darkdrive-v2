package com.darkdrive.backend.util;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;

public class CryptoUtil {
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int IV_LENGTH = 12; // Recommended IV size for GCM (96 bits)
    private static final int TAG_LENGTH = 128; // Authentication tag length in bits (16 bytes)

    private static SecretKeySpec getKey(String password) throws Exception {
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        byte[] key = sha.digest(password.getBytes(StandardCharsets.UTF_8));
        key = Arrays.copyOf(key, 16); // 128-bit key for AES
        return new SecretKeySpec(key, ALGORITHM);
    }

    public static byte[] encrypt(byte[] data, String password) throws Exception {
        SecretKeySpec key = getKey(password);

        // Generate a random IV
        byte[] iv = new byte[IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv);

        // Initialize cipher for encryption
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);

        // Encrypt the data
        byte[] encryptedBytes = cipher.doFinal(data);

        // Combine IV and encrypted data (IV first, then ciphertext + tag)
        ByteBuffer buffer = ByteBuffer.allocate(iv.length + encryptedBytes.length);
        buffer.put(iv);
        buffer.put(encryptedBytes);
        return buffer.array();
    }

    public static byte[] decrypt(byte[] data, String password) throws Exception {
        SecretKeySpec key = getKey(password);

        // Extract IV and ciphertext from the data
        if (data.length < IV_LENGTH) {
            throw new IllegalArgumentException("Encrypted data too short");
        }
        byte[] iv = Arrays.copyOfRange(data, 0, IV_LENGTH);
        byte[] ciphertext = Arrays.copyOfRange(data, IV_LENGTH, data.length);

        // Initialize cipher for decryption
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH, iv);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);

        // Decrypt (will fail with AEADBadTagException if password is wrong)
        return cipher.doFinal(ciphertext);
    }
}
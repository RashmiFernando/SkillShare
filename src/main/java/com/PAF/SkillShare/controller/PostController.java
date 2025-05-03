package com.PAF.SkillShare.controller;

import com.PAF.SkillShare.model.Post;
import com.PAF.SkillShare.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend to access the backend
public class PostController {

    private final String UPLOAD_DIR = "uploads/";

    @Autowired
    private PostService postService;

    // Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // Get post by ID
    @GetMapping("/{id}")
    public Post getPostById(@PathVariable String id) {
        return postService.getPostById(id).orElse(null);
    }

    // Create a post with media
    @PostMapping("/upload")

    public ResponseEntity<Post> createPostWithMedia(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("postedBy") String postedBy,
            @RequestParam(value = "mediaFiles", required = false) MultipartFile[] mediaFiles
    ) {
        List<String> mediaUrls = new ArrayList<>();

        // Save media files to server
        if (mediaFiles != null) {
            for (MultipartFile file : mediaFiles) {
                try {
                    String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
                    Path uploadPath = Paths.get(UPLOAD_DIR);
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    mediaUrls.add("/uploads/" + fileName);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        // Create and save the new post
        Post post = new Post();
        post.setTitle(title);
        post.setDescription(description);
        post.setCategory(category);
        post.setPostedBy(postedBy);
        post.setCreatedAt(String.valueOf(System.currentTimeMillis()));
        post.setMediaUrls(mediaUrls);

        // Save the post to the repository and return it
        return ResponseEntity.ok(postService.createPost(post));
    }

    // Update post (including media)
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePostWithMedia(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("postedBy") String postedBy,
            @RequestParam(value = "mediaFiles", required = false) MultipartFile[] mediaFiles
    ) {
        // Fetch existing post
        Post existingPost = postService.getPostById(id).orElse(null);

        if (existingPost != null) {
            // Update fields
            existingPost.setTitle(title);
            existingPost.setDescription(description);
            existingPost.setCategory(category);
            existingPost.setPostedBy(postedBy);

            List<String> mediaUrls = new ArrayList<>();

            // Handle file update
            if (mediaFiles != null && mediaFiles.length > 0) {
                // Delete old image files if necessary (optional step)
                for (String oldImageUrl : existingPost.getMediaUrls()) {
                    try {
                        Path oldFilePath = Paths.get("uploads" + oldImageUrl);
                        Files.deleteIfExists(oldFilePath);  // Delete old file if exists
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                // Save new media files to server
                for (MultipartFile file : mediaFiles) {
                    try {
                        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
                        Path uploadPath = Paths.get(UPLOAD_DIR);
                        if (!Files.exists(uploadPath)) {
                            Files.createDirectories(uploadPath);
                        }
                        Path filePath = uploadPath.resolve(fileName);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        mediaUrls.add("/uploads/" + fileName);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            existingPost.setMediaUrls(mediaUrls);  // Update media URLs

            postService.createPost(existingPost);  // Save updated post

            return ResponseEntity.ok(existingPost);
        } else {
            return ResponseEntity.status(404).body(null); // Post not found
        }
    }

    // Like a post
    @PutMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable String id) {
        Post post = postService.likePost(id);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.status(404).body(null); // Post not found
        }
    }

    // Delete post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        boolean deleted = postService.deletePost(id);
        if (deleted) {
            return ResponseEntity.ok().build(); // Successfully deleted
        } else {
            return ResponseEntity.status(404).build(); // Post not found
        }
    }

    // Add comment to a post
    @PutMapping("/{id}/comment")
    public ResponseEntity<Post> addComment(@PathVariable String id, @RequestBody String comment) {
        Post post = postService.addComment(id, comment);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.status(404).body(null); // Post not found
        }
    }

    // Delete comment from a post
    @DeleteMapping("/{postId}/comment/{commentIndex}/delete")
    public ResponseEntity<Post> deleteComment(@PathVariable String postId, @PathVariable int commentIndex) {
        Post post = postService.deleteComment(postId, commentIndex);
        if (post != null) {
            return ResponseEntity.ok(post);
        } else {
            return ResponseEntity.status(404).body(null); // Post or comment not found
        }
    }
}

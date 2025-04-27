package com.PAF.SkillShare.service;
import com.PAF.SkillShare.model.Post;
import com.PAF.SkillShare.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(String id, Post updatedPost) {
        return postRepository.findById(id).map(post -> {
            post.setTitle(updatedPost.getTitle());
            post.setDescription(updatedPost.getDescription());
            post.setMediaUrls(updatedPost.getMediaUrls());
            post.setCategory(updatedPost.getCategory());
            post.setPostedBy(updatedPost.getPostedBy());
            post.setCreatedAt(updatedPost.getCreatedAt());
            return postRepository.save(post);
        }).orElse(null);
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }
}


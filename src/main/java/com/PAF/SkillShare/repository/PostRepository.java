package com.PAF.SkillShare.repository;

import com.PAF.SkillShare.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}


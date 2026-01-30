package com.quiziq.quiziq.service;

import com.quiziq.quiziq.model.Topic;
import com.quiziq.quiziq.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TopicService {
    private final TopicRepository topicRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Topic getTopicById(Long id) {
        return topicRepository.findById(id).orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    public Topic createTopic(Topic topic) {
        return topicRepository.save(topic);
    }

    public Topic updateTopic(Long id, Topic topicDetails) {
        Topic topic = getTopicById(id);
        topic.setName(topicDetails.getName());
        topic.setDescription(topicDetails.getDescription());
        return topicRepository.save(topic);
    }

    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }
}

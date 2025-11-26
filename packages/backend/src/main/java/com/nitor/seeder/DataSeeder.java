package com.nitor.seeder;

import com.nitor.model.*;
import com.nitor.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

/**
 * Database seeder for development and testing
 *
 * Only runs in 'dev' profile to avoid accidental data seeding in production
 * Disable with: spring.data.seed.enabled=false
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ContentRepository contentRepository;
    private final CommentRepository commentRepository;
    private final ConnectionRepository connectionRepository;
    private final FollowRepository followRepository;
    private final EndorsementRepository endorsementRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();
    private final List<UUID> userIds = new ArrayList<>();

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting database seeding...");

        // Check if already seeded
        if (userRepository.count() > 0) {
            log.info("Database already contains data, skipping seeding");
            return;
        }

        try {
            seedUsers();
            seedConnections();
            seedContent();
            seedComments();
            seedInteractions();

            log.info("Database seeding completed successfully!");
            log.info("Created {} users, {} content posts, {} comments",
                    userRepository.count(),
                    contentRepository.count(),
                    commentRepository.count());
        } catch (Exception e) {
            log.error("Error during database seeding", e);
        }
    }

    private void seedUsers() {
        log.info("Seeding users and profiles...");

        String[][] usersData = {
                { "John Doe", "johndoe", "john.doe@university.edu", "Professor", "Computer Science",
                        "Massachusetts Institute of Technology" },
                { "Jane Smith", "janesmith", "jane.smith@research.org", "Dr.", "Artificial Intelligence",
                        "Stanford University" },
                { "Alice Johnson", "alicejohnson", "alice.j@college.edu", "Associate Professor", "Quantum Physics",
                        "Harvard University" },
                { "Bob Williams", "bobwilliams", "bob.w@institute.edu", "Professor", "Neuroscience",
                        "University of Oxford" },
                { "Carol Martinez", "carolmartinez", "carol.m@university.edu", "Dr.", "Genetics",
                        "University of Cambridge" },
                { "David Brown", "davidbrown", "david.b@research.org", "Professor", "Astrophysics",
                        "Princeton University" },
                { "Eva Garcia", "evagarcia", "eva.g@college.edu", "Dr.", "Marine Biology",
                        "University of California, Berkeley" },
                { "Frank Miller", "frankmiller", "frank.m@institute.edu", "Professor", "Economics", "Yale University" },
                { "Grace Lee", "gracelee", "grace.l@university.edu", "Dr.", "Psychology", "University of Chicago" },
                { "Henry Wilson", "henrywilson", "henry.w@research.org", "Professor", "Mathematics",
                        "California Institute of Technology" }
        };

        for (String[] userData : usersData) {
            // Create User
            User user = User.builder()
                    .email(userData[2])
                    .passwordHash(passwordEncoder.encode("password123"))
                    .emailVerified(true)
                    .isActive(true)
                    .build();
            user = userRepository.save(user);
            userIds.add(user.getId());

            // Create Profile
            com.nitor.model.Profile profile = com.nitor.model.Profile.builder()
                    .id(user.getId())
                    .user(user)
                    .fullName(userData[0])
                    .handle(userData[1])
                    .academicTitle(userData[3])
                    .discipline(userData[4])
                    .institution(userData[5])
                    .bio("Passionate researcher in " + userData[4] + " at " + userData[5])
                    .nitorScore(BigDecimal.valueOf(random.nextInt(1000)))
                    .verified(random.nextBoolean())
                    .onboardingComplete(true)
                    .followersCount(0)
                    .followingCount(0)
                    .publicationsCount(0)
                    .profileVisibility(com.nitor.model.Profile.ProfileVisibility.PUBLIC)
                    .build();
            profileRepository.save(profile);
        }

        log.info("Created {} users and profiles", usersData.length);
    }

    private void seedConnections() {
        log.info("Seeding connections and follows...");

        int connectionsCreated = 0;
        int followsCreated = 0;

        // Create random connections between users
        for (int i = 0; i < userIds.size(); i++) {
            UUID userId1 = userIds.get(i);

            // Each user connects with 3-5 random other users
            int numConnections = 3 + random.nextInt(3);
            for (int j = 0; j < numConnections; j++) {
                UUID userId2 = userIds.get(random.nextInt(userIds.size()));

                if (!userId1.equals(userId2) &&
                        !connectionRepository.existsByUserIdAndConnectedUserId(userId1, userId2)) {

                    Connection connection = Connection.builder()
                            .userId(userId1)
                            .connectedUserId(userId2)
                            .status(Connection.ConnectionStatus.ACCEPTED)
                            .build();
                    connectionRepository.save(connection);
                    connectionsCreated++;

                    // Create reciprocal connection
                    Connection reciprocal = Connection.builder()
                            .userId(userId2)
                            .connectedUserId(userId1)
                            .status(Connection.ConnectionStatus.ACCEPTED)
                            .build();
                    connectionRepository.save(reciprocal);
                    connectionsCreated++;
                }
            }

            // Each user follows 2-4 random users
            int numFollows = 2 + random.nextInt(3);
            for (int j = 0; j < numFollows; j++) {
                UUID followingId = userIds.get(random.nextInt(userIds.size()));

                if (!userId1.equals(followingId) &&
                        !followRepository.existsByFollowerIdAndFollowingId(userId1, followingId)) {

                    Follow follow = Follow.builder()
                            .followerId(userId1)
                            .followingId(followingId)
                            .build();
                    followRepository.save(follow);
                    followsCreated++;
                }
            }
        }

        log.info("Created {} connections and {} follows", connectionsCreated, followsCreated);
    }

    private void seedContent() {
        log.info("Seeding content posts...");

        String[] contentBodies = {
                "Excited to share our latest research findings on neural networks! #AI #Research",
                "Just published a new paper on quantum entanglement. Check it out! #Physics #Science",
                "Fascinating discussion at today's conference about climate change impacts. #Climate #Environment",
                "Our lab's breakthrough in CRISPR gene editing is now published in Nature! #Genetics #Biotech",
                "Looking forward to the upcoming symposium on renewable energy. #Energy #Sustainability",
                "New insights into black hole formation from our recent observations. #Astrophysics #Space",
                "Collaboration opportunity: seeking partners for marine conservation project. #MarineBiology #Conservation",
                "Thoughts on the latest economic trends and their global implications. #Economics #Finance",
                "Interesting findings from our cognitive psychology study on memory retention. #Psychology #CognitiveScience",
                "Mathematical proof of a long-standing conjecture finally completed! #Mathematics #Theory"
        };

        int postsPerUser = 3;
        for (UUID authorId : userIds) {
            for (int i = 0; i < postsPerUser; i++) {
                String body = contentBodies[random.nextInt(contentBodies.length)];

                // Fetch author profile reference
                com.nitor.model.Profile author = profileRepository.getReferenceById(authorId);

                Content content = Content.builder()
                        .author(author)
                        .body(body + " (Seed data)")
                        .type(Content.ContentType.POST)
                        .visibility(Content.ContentVisibility.PUBLIC)
                        .endorsementsCount(0)
                        .commentsCount(0)
                        .repostsCount(0)
                        .build();
                contentRepository.save(content);
            }
        }

        log.info("Created {} content posts", userIds.size() * postsPerUser);
    }

    private void seedComments() {
        log.info("Seeding comments...");

        String[] commentBodies = {
                "Great work! Very insightful.",
                "This is fascinating research.",
                "Could you elaborate on the methodology?",
                "Excellent findings! Looking forward to more.",
                "Interesting perspective on this topic.",
                "Thank you for sharing this!",
                "This aligns with our recent findings.",
                "Would love to collaborate on this.",
                "Impressive results!",
                "This could have significant implications."
        };

        List<Content> allContent = contentRepository.findAll();
        int commentsCreated = 0;

        for (Content content : allContent) {
            // Each post gets 1-3 random comments
            int numComments = 1 + random.nextInt(3);
            for (int i = 0; i < numComments; i++) {
                UUID commentAuthorId = userIds.get(random.nextInt(userIds.size()));
                com.nitor.model.Profile commentAuthor = profileRepository.getReferenceById(commentAuthorId);

                Comment comment = Comment.builder()
                        .content(content)
                        .author(commentAuthor)
                        .body(commentBodies[random.nextInt(commentBodies.length)])
                        .likesCount(0)
                        .build();
                commentRepository.save(comment);
                commentsCreated++;
            }
        }

        log.info("Created {} comments", commentsCreated);
    }

    private void seedInteractions() {
        log.info("Seeding content interactions...");

        List<Content> allContent = contentRepository.findAll();
        int endorsementsCreated = 0;

        for (Content content : allContent) {
            // Each post gets 2-5 endorsements from random users
            int numEndorsements = 2 + random.nextInt(4);
            for (int i = 0; i < numEndorsements; i++) {
                UUID userId = userIds.get(random.nextInt(userIds.size()));

                if (!userId.equals(content.getAuthor().getId()) &&
                        !endorsementRepository.existsByUserIdAndContentId(userId, content.getId())) {

                    Endorsement endorsement = Endorsement.builder()
                            .userId(userId)
                            .contentId(content.getId())
                            .build();
                    endorsementRepository.save(endorsement);
                    endorsementsCreated++;
                }
            }
        }

        log.info("Created {} endorsements", endorsementsCreated);
    }
}

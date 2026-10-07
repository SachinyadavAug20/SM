package com.society.sm.config;

import com.society.sm.model.Complaint;
import com.society.sm.model.Notice;
import com.society.sm.model.User;
import com.society.sm.repository.ComplaintRepository;
import com.society.sm.repository.NoticeRepository;
import com.society.sm.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final NoticeRepository noticeRepository;

    public DataInitializer(UserRepository userRepository, ComplaintRepository complaintRepository, NoticeRepository noticeRepository) {
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.noticeRepository = noticeRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User committee = new User(null, "Admin Committee", "admin@society.com", "admin123", "Office-1", "COMMITTEE", 0.0, true);
            userRepository.save(committee);

            User member1 = new User(null, "Sachin Yadav", "sachin@society.com", "sachin123", "A-101", "MEMBER", 2500.0, false);
            User member2 = new User(null, "Rahul Sharma", "rahul@society.com", "rahul123", "B-204", "MEMBER", 2500.0, true);
            User member3 = new User(null, "Pooja Verma", "pooja@society.com", "pooja123", "C-302", "MEMBER", 2500.0, false);
            userRepository.save(member1);
            userRepository.save(member2);
            userRepository.save(member3);

            Notice notice1 = new Notice(null, "Water Tank Cleaning", "Society water tanks will be cleaned on Saturday from 10 AM to 2 PM. Please store water.", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            Notice notice2 = new Notice(null, "Annual General Meeting", "The annual general meeting is scheduled for next Sunday at 6 PM in the club house.", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            noticeRepository.save(notice1);
            noticeRepository.save(notice2);

            Complaint complaint1 = new Complaint(null, "Lift not working", "The lift in Wing A is stuck on 3rd floor.", "A-101", "Sachin Yadav", member1.getId(), "PENDING", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            Complaint complaint2 = new Complaint(null, "Street light flickering", "Street light near gate 2 is flickering continuously.", "B-204", "Rahul Sharma", member2.getId(), "RESOLVED", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            complaintRepository.save(complaint1);
            complaintRepository.save(complaint2);
        }
    }
}

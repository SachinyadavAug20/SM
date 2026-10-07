package com.society.sm.controller;

import com.society.sm.model.Complaint;
import com.society.sm.model.Notice;
import com.society.sm.model.User;
import com.society.sm.service.ComplaintService;
import com.society.sm.service.NoticeService;
import com.society.sm.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/committee")
public class CommitteeController {

    private final UserService userService;
    private final ComplaintService complaintService;
    private final NoticeService noticeService;

    public CommitteeController(UserService userService, ComplaintService complaintService, NoticeService noticeService) {
        this.userService = userService;
        this.complaintService = complaintService;
        this.noticeService = noticeService;
    }

    @GetMapping("/members")
    public ResponseEntity<List<User>> getAllMembers() {
        return ResponseEntity.ok(userService.getAllMembers());
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "RESOLVED");
        Complaint updated = complaintService.updateStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/notices")
    public ResponseEntity<Notice> postNotice(@RequestBody Notice notice) {
        return ResponseEntity.ok(noticeService.createNotice(notice));
    }

    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }
}
